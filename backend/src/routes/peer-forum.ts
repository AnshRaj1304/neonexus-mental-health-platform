import express from 'express';
import { body, query, validationResult } from 'express-validator';
import { authenticate, authorize } from '../middleware/auth';
import { DatabaseConnection } from '../utils/database';
import { z } from 'zod';
import { randomUUID } from 'crypto';

const router = express.Router();

// Helper function to get database connection
const getDb = (req: express.Request): DatabaseConnection => {
  return req.app.locals.db();
};

// Helper function for role-based authorization
const requireRole = (roles: string[]) => authorize(roles);

// Validation schemas
const categorySchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  is_anonymous_only: z.boolean().default(true),
  requires_approval: z.boolean().default(false)
});

const postSchema = z.object({
  category_id: z.number().int().positive(),
  title: z.string().min(1).max(200),
  content: z.string().min(1).max(10000),
  is_anonymous: z.boolean().default(true),
  tags: z.array(z.string().max(50)).optional(),
  trigger_warning: z.boolean().default(false),
  trigger_warning_content: z.string().max(200).optional()
});

const replySchema = z.object({
  post_id: z.string().uuid(),
  content: z.string().min(1).max(5000),
  is_anonymous: z.boolean().default(true),
  parent_reply_id: z.string().uuid().optional()
});

const moderationActionSchema = z.object({
  target_type: z.enum(['post', 'reply']),
  target_id: z.string().uuid(),
  action: z.enum(['approve', 'remove', 'flag', 'unflag', 'pin', 'unpin']),
  reason: z.string().max(500).optional(),
  internal_notes: z.string().max(1000).optional()
});

const reportSchema = z.object({
  target_type: z.enum(['post', 'reply']),
  target_id: z.string().uuid(),
  reason: z.enum(['harassment', 'spam', 'inappropriate_content', 'self_harm', 'misinformation', 'other']),
  description: z.string().max(1000).optional()
});

// Content moderation and safety features
class ForumModerator {
  // Inappropriate content patterns
  private static readonly INAPPROPRIATE_PATTERNS = [
    /\b(kill yourself|kys)\b/gi,
    /\b(fuck|shit|damn)\b/gi,
    /\b(harassment|bully|bullying)\b/gi,
    /\b(drug|drugs|alcohol|drinking)\b/gi
  ];

  // Self-harm indicators (requires immediate attention)
  private static readonly SELF_HARM_PATTERNS = [
    /\b(suicide|suicidal|kill myself|end my life|self harm|cutting|hurt myself)\b/gi,
    /\b(overdose|pills|razor|blade)\b/gi,
    /\b(better off dead|want to die|can't go on)\b/gi
  ];

  // Professional help keywords
  private static readonly HELP_SEEKING_PATTERNS = [
    /\b(therapist|counselor|medication|therapy|depression|anxiety)\b/gi,
    /\b(psychiatrist|psychologist|mental health|crisis|emergency)\b/gi
  ];

  static moderateContent(content: string): {
    approved: boolean;
    flagged: boolean;
    requiresReview: boolean;
    concerns: string[];
    recommendations: string[];
  } {
    const concerns: string[] = [];
    const recommendations: string[] = [];
    let approved = true;
    let flagged = false;
    let requiresReview = false;

    // Check for self-harm content
    if (this.SELF_HARM_PATTERNS.some(pattern => pattern.test(content))) {
      concerns.push('Self-harm indicators detected');
      recommendations.push('Immediate counselor review required');
      flagged = true;
      requiresReview = true;
      approved = false;
    }

    // Check for inappropriate content
    if (this.INAPPROPRIATE_PATTERNS.some(pattern => pattern.test(content))) {
      concerns.push('Potentially inappropriate language detected');
      requiresReview = true;
    }

    // Check for help-seeking content
    if (this.HELP_SEEKING_PATTERNS.some(pattern => pattern.test(content))) {
      concerns.push('Professional help seeking detected');
      recommendations.push('Consider connecting user with counseling resources');
      requiresReview = true;
    }

    // Content length check
    if (content.length > 5000) {
      concerns.push('Unusually long content');
      requiresReview = true;
    }

    return {
      approved,
      flagged,
      requiresReview,
      concerns,
      recommendations
    };
  }

  static generateAnonymousName(): string {
    const adjectives = [
      'Brave', 'Strong', 'Kind', 'Hopeful', 'Peaceful', 'Caring', 'Gentle', 
      'Resilient', 'Wise', 'Thoughtful', 'Compassionate', 'Courageous'
    ];
    
    const nouns = [
      'Soul', 'Heart', 'Mind', 'Spirit', 'Friend', 'Student', 'Person',
      'Warrior', 'Helper', 'Listener', 'Supporter', 'Voice'
    ];

    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const number = Math.floor(Math.random() * 9999) + 1;

    return `${adjective}${noun}${number}`;
  }
}

// Get forum categories
router.get('/categories', authenticate, async (req: express.Request, res: express.Response) => {
  try {
    const user = req.user!;
    const db = getDb(req);

    const categories = await db.all(`
      SELECT 
        id, name, description, color, is_anonymous_only, requires_approval,
        is_active, created_at,
        (SELECT COUNT(*) FROM forum_posts WHERE category_id = forum_categories.id AND status = 'published') as post_count,
        (SELECT COUNT(*) FROM forum_posts WHERE category_id = forum_categories.id AND created_at > datetime('now', '-7 days') AND status = 'published') as recent_posts
      FROM forum_categories 
      WHERE is_active = 1
      ORDER BY display_order ASC, name ASC
    `);

    res.json({
      success: true,
      data: categories
    });

  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Create forum category (admin only)
router.post('/categories', authenticate, requireRole(['admin']), async (req: express.Request, res: express.Response) => {
  try {
    const validation = categorySchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category data',
        errors: validation.error.issues
      });
    }

    const user = req.user!;
    const db = getDb(req);
    const data = validation.data;

    const result = await db.run(`
      INSERT INTO forum_categories (
        name, description, color, is_anonymous_only, requires_approval,
        created_by, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `, [
      data.name,
      data.description,
      data.color,
      data.is_anonymous_only ? 1 : 0,
      data.requires_approval ? 1 : 0,
      user.userId
    ]);

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: { categoryId: result.lastID }
    });

  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get posts in a category
router.get('/categories/:categoryId/posts', authenticate, async (req: express.Request, res: express.Response) => {
  try {
    const { categoryId } = req.params;
    const user = req.user!;
    const db = getDb(req);
    const {
      page = '1',
      limit = '10',
      sort_by = 'created_at',
      sort_order = 'desc',
      filter = 'all'
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const offset = (pageNum - 1) * limitNum;

    // Verify category exists
    const category = await db.get(
      'SELECT id, name FROM forum_categories WHERE id = ? AND is_active = 1',
      [categoryId]
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Build query conditions
    let whereClause = 'WHERE fp.category_id = ? AND fp.status = "published"';
    const params: any[] = [categoryId];

    if (filter === 'pinned') {
      whereClause += ' AND fp.is_pinned = 1';
    } else if (filter === 'recent') {
      whereClause += ' AND fp.created_at > datetime("now", "-7 days")';
    }

    // Validate sort parameters
    const allowedSortFields = ['created_at', 'updated_at', 'reply_count', 'like_count'];
    const sortField = allowedSortFields.includes(sort_by as string) ? sort_by : 'created_at';
    const sortDir = sort_order === 'asc' ? 'ASC' : 'DESC';

    // Special sorting for pinned posts
    const orderByClause = `fp.is_pinned DESC, fp.${sortField} ${sortDir}`;

    // Get total count
    const countResult = await db.get(`
      SELECT COUNT(*) as total
      FROM forum_posts fp
      ${whereClause}
    `, params);

    // Get posts
    const posts = await db.all(`
      SELECT 
        fp.id, fp.title, fp.content, fp.is_anonymous, fp.anonymous_name,
        fp.tags, fp.trigger_warning, fp.trigger_warning_content,
        fp.like_count, fp.reply_count, fp.is_pinned, fp.created_at, fp.updated_at,
        CASE WHEN fp.is_anonymous = 1 THEN NULL ELSE u.username END as author_username,
        CASE WHEN fp.is_anonymous = 1 THEN NULL ELSE sp.name END as author_name
      FROM forum_posts fp
      LEFT JOIN users u ON fp.user_id = u.id
      LEFT JOIN student_profiles sp ON u.id = sp.user_id
      ${whereClause}
      ORDER BY ${orderByClause}
      LIMIT ? OFFSET ?
    `, [...params, limitNum, offset]);

    // Parse JSON fields
    const formattedPosts = posts.map((post: any) => ({
      ...post,
      tags: post.tags ? JSON.parse(post.tags) : [],
      triggerWarning: Boolean(post.trigger_warning),
      triggerWarningContent: post.trigger_warning_content,
      isPinned: Boolean(post.is_pinned)
    }));

    res.json({
      success: true,
      data: {
        category: category,
        posts: formattedPosts,
        pagination: {
          currentPage: pageNum,
          totalPages: Math.ceil(countResult.total / limitNum),
          totalPosts: countResult.total,
          limit: limitNum
        }
      }
    });

  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Create a new forum post
router.post('/posts', authenticate, async (req: express.Request, res: express.Response) => {
  try {
    const validation = postSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: 'Invalid post data',
        errors: validation.error.issues
      });
    }

    const user = req.user!;
    const db = getDb(req);
    const data = validation.data;

    // Verify category exists
    const category = await db.get(
      'SELECT id, requires_approval FROM forum_categories WHERE id = ? AND is_active = 1',
      [data.category_id]
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Moderate content
    const moderation = ForumModerator.moderateContent(data.content);
    
    // Generate anonymous name if needed
    const anonymousName = data.is_anonymous ? ForumModerator.generateAnonymousName() : null;

    // Determine post status
    let status = 'published';
    if (!moderation.approved || category.requires_approval || moderation.requiresReview) {
      status = 'pending';
    }

    const postId = randomUUID();

    // Create post
    const result = await db.run(`
      INSERT INTO forum_posts (
        id, user_id, category_id, title, content, is_anonymous, anonymous_name,
        tags, trigger_warning, trigger_warning_content, status, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `, [
      postId,
      user.userId,
      data.category_id,
      data.title,
      data.content,
      data.is_anonymous ? 1 : 0,
      anonymousName,
      JSON.stringify(data.tags || []),
      data.trigger_warning ? 1 : 0,
      data.trigger_warning_content || null,
      status
    ]);

    // Log moderation results if needed
    if (moderation.requiresReview || !moderation.approved) {
      await db.run(`
        INSERT INTO forum_moderation_log (
          id, target_type, target_id, user_id, action, reason, 
          system_flags, created_at
        ) VALUES (?, 'post', ?, ?, 'auto_review', ?, ?, CURRENT_TIMESTAMP)
      `, [
        randomUUID(),
        postId,
        user.userId,
        'Content flagged for review',
        JSON.stringify({
          concerns: moderation.concerns,
          recommendations: moderation.recommendations,
          flagged: moderation.flagged
        })
      ]);
    }

    // Create crisis alert if self-harm detected
    if (moderation.flagged && moderation.concerns.includes('Self-harm indicators detected')) {
      await db.run(`
        INSERT INTO crisis_alerts (
          user_id, risk_level, risk_score, trigger_type, trigger_data,
          factors, recommendations, requires_immediate_attention,
          detected_by_user_id, status, created_at
        ) VALUES (?, 'high', 60, 'manual', ?, ?, ?, 1, ?, 'new', CURRENT_TIMESTAMP)
      `, [
        user.userId,
        JSON.stringify({ source: 'forum_post', post_id: postId }),
        JSON.stringify(['Self-harm language detected in forum post']),
        JSON.stringify(['Immediate counselor review of forum activity']),
        user.userId
      ]);
    }

    res.status(201).json({
      success: true,
      message: status === 'pending' ? 'Post submitted for review' : 'Post created successfully',
      data: {
        postId,
        status,
        requiresReview: moderation.requiresReview
      }
    });

  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get a specific post with replies
router.get('/posts/:postId', authenticate, async (req: express.Request, res: express.Response) => {
  try {
    const { postId } = req.params;
    const user = req.user!;
    const db = getDb(req);

    // Get post details
    const post = await db.get(`
      SELECT 
        fp.id, fp.title, fp.content, fp.is_anonymous, fp.anonymous_name,
        fp.tags, fp.trigger_warning, fp.trigger_warning_content,
        fp.like_count, fp.reply_count, fp.is_pinned, fp.created_at, fp.updated_at,
        fc.name as category_name, fc.color as category_color,
        CASE WHEN fp.is_anonymous = 1 THEN NULL ELSE u.username END as author_username,
        CASE WHEN fp.is_anonymous = 1 THEN NULL ELSE sp.name END as author_name,
        (SELECT COUNT(*) FROM forum_post_likes WHERE post_id = fp.id AND user_id = ?) as user_liked
      FROM forum_posts fp
      JOIN forum_categories fc ON fp.category_id = fc.id
      LEFT JOIN users u ON fp.user_id = u.id
      LEFT JOIN student_profiles sp ON u.id = sp.user_id
      WHERE fp.id = ? AND fp.status = 'published'
    `, [user.userId, postId]);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Get replies (hierarchical structure)
    const replies = await db.all(`
      SELECT 
        fr.id, fr.content, fr.is_anonymous, fr.anonymous_name,
        fr.parent_reply_id, fr.like_count, fr.created_at,
        CASE WHEN fr.is_anonymous = 1 THEN NULL ELSE u.username END as author_username,
        CASE WHEN fr.is_anonymous = 1 THEN NULL ELSE sp.name END as author_name,
        (SELECT COUNT(*) FROM forum_reply_likes WHERE reply_id = fr.id AND user_id = ?) as user_liked
      FROM forum_replies fr
      LEFT JOIN users u ON fr.user_id = u.id
      LEFT JOIN student_profiles sp ON u.id = sp.user_id
      WHERE fr.post_id = ? AND fr.status = 'published'
      ORDER BY fr.created_at ASC
    `, [user.userId, postId]);

    // Organize replies into hierarchical structure
    const topLevelReplies = replies.filter(reply => !reply.parent_reply_id);
    const organizedReplies = topLevelReplies.map(reply => ({
      ...reply,
      userLiked: Boolean(reply.user_liked),
      childReplies: replies.filter(childReply => childReply.parent_reply_id === reply.id)
        .map(childReply => ({
          ...childReply,
          userLiked: Boolean(childReply.user_liked)
        }))
    }));

    // Increment view count (asynchronously)
    db.run('UPDATE forum_posts SET view_count = view_count + 1 WHERE id = ?', [postId])
      .catch(err => console.error('Error updating view count:', err));

    const formattedPost = {
      ...post,
      tags: post.tags ? JSON.parse(post.tags) : [],
      triggerWarning: Boolean(post.trigger_warning),
      triggerWarningContent: post.trigger_warning_content,
      isPinned: Boolean(post.is_pinned),
      userLiked: Boolean(post.user_liked),
      category: {
        name: post.category_name,
        color: post.category_color
      }
    };

    res.json({
      success: true,
      data: {
        post: formattedPost,
        replies: organizedReplies
      }
    });

  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Create a reply to a post
router.post('/replies', authenticate, async (req: express.Request, res: express.Response) => {
  try {
    const validation = replySchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: 'Invalid reply data',
        errors: validation.error.issues
      });
    }

    const user = req.user!;
    const db = getDb(req);
    const data = validation.data;

    // Verify post exists
    const post = await db.get(
      'SELECT id, user_id FROM forum_posts WHERE id = ? AND status = "published"',
      [data.post_id]
    );

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Verify parent reply exists if specified
    if (data.parent_reply_id) {
      const parentReply = await db.get(
        'SELECT id FROM forum_replies WHERE id = ? AND post_id = ? AND status = "published"',
        [data.parent_reply_id, data.post_id]
      );

      if (!parentReply) {
        return res.status(404).json({
          success: false,
          message: 'Parent reply not found'
        });
      }
    }

    // Moderate content
    const moderation = ForumModerator.moderateContent(data.content);
    
    // Generate anonymous name if needed
    const anonymousName = data.is_anonymous ? ForumModerator.generateAnonymousName() : null;

    // Determine reply status
    const status = moderation.approved && !moderation.requiresReview ? 'published' : 'pending';

    const replyId = randomUUID();

    // Create reply
    await db.run(`
      INSERT INTO forum_replies (
        id, post_id, user_id, parent_reply_id, content, is_anonymous, 
        anonymous_name, status, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `, [
      replyId,
      data.post_id,
      user.userId,
      data.parent_reply_id || null,
      data.content,
      data.is_anonymous ? 1 : 0,
      anonymousName,
      status
    ]);

    // Update post reply count if reply is published
    if (status === 'published') {
      await db.run(
        'UPDATE forum_posts SET reply_count = reply_count + 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [data.post_id]
      );
    }

    // Log moderation results if needed
    if (moderation.requiresReview || !moderation.approved) {
      await db.run(`
        INSERT INTO forum_moderation_log (
          id, target_type, target_id, user_id, action, reason,
          system_flags, created_at
        ) VALUES (?, 'reply', ?, ?, 'auto_review', ?, ?, CURRENT_TIMESTAMP)
      `, [
        randomUUID(),
        replyId,
        user.userId,
        'Content flagged for review',
        JSON.stringify({
          concerns: moderation.concerns,
          recommendations: moderation.recommendations,
          flagged: moderation.flagged
        })
      ]);
    }

    // Create crisis alert if self-harm detected
    if (moderation.flagged && moderation.concerns.includes('Self-harm indicators detected')) {
      await db.run(`
        INSERT INTO crisis_alerts (
          user_id, risk_level, risk_score, trigger_type, trigger_data,
          factors, recommendations, requires_immediate_attention,
          detected_by_user_id, status, created_at
        ) VALUES (?, 'high', 60, 'manual', ?, ?, ?, 1, ?, 'new', CURRENT_TIMESTAMP)
      `, [
        user.userId,
        JSON.stringify({ source: 'forum_reply', reply_id: replyId }),
        JSON.stringify(['Self-harm language detected in forum reply']),
        JSON.stringify(['Immediate counselor review of forum activity']),
        user.userId
      ]);
    }

    res.status(201).json({
      success: true,
      message: status === 'pending' ? 'Reply submitted for review' : 'Reply created successfully',
      data: {
        replyId,
        status,
        requiresReview: moderation.requiresReview
      }
    });

  } catch (error) {
    console.error('Create reply error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Like/unlike a post
router.post('/posts/:postId/like', authenticate, async (req: express.Request, res: express.Response) => {
  try {
    const { postId } = req.params;
    const user = req.user!;
    const db = getDb(req);

    // Verify post exists
    const post = await db.get(
      'SELECT id FROM forum_posts WHERE id = ? AND status = "published"',
      [postId]
    );

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Check if user already liked the post
    const existingLike = await db.get(
      'SELECT id FROM forum_post_likes WHERE post_id = ? AND user_id = ?',
      [postId, user.userId]
    );

    if (existingLike) {
      // Remove like
      await db.run('DELETE FROM forum_post_likes WHERE id = ?', [existingLike.id]);
      await db.run('UPDATE forum_posts SET like_count = like_count - 1 WHERE id = ?', [postId]);
      
      res.json({
        success: true,
        message: 'Like removed',
        data: { liked: false }
      });
    } else {
      // Add like
      await db.run(`
        INSERT INTO forum_post_likes (id, post_id, user_id, created_at)
        VALUES (?, ?, ?, CURRENT_TIMESTAMP)
      `, [randomUUID(), postId, user.userId]);
      
      await db.run('UPDATE forum_posts SET like_count = like_count + 1 WHERE id = ?', [postId]);
      
      res.json({
        success: true,
        message: 'Post liked',
        data: { liked: true }
      });
    }

  } catch (error) {
    console.error('Like post error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Like/unlike a reply
router.post('/replies/:replyId/like', authenticate, async (req: express.Request, res: express.Response) => {
  try {
    const { replyId } = req.params;
    const user = req.user!;
    const db = getDb(req);

    // Verify reply exists
    const reply = await db.get(
      'SELECT id FROM forum_replies WHERE id = ? AND status = "published"',
      [replyId]
    );

    if (!reply) {
      return res.status(404).json({
        success: false,
        message: 'Reply not found'
      });
    }

    // Check if user already liked the reply
    const existingLike = await db.get(
      'SELECT id FROM forum_reply_likes WHERE reply_id = ? AND user_id = ?',
      [replyId, user.userId]
    );

    if (existingLike) {
      // Remove like
      await db.run('DELETE FROM forum_reply_likes WHERE id = ?', [existingLike.id]);
      await db.run('UPDATE forum_replies SET like_count = like_count - 1 WHERE id = ?', [replyId]);
      
      res.json({
        success: true,
        message: 'Like removed',
        data: { liked: false }
      });
    } else {
      // Add like
      await db.run(`
        INSERT INTO forum_reply_likes (id, reply_id, user_id, created_at)
        VALUES (?, ?, ?, CURRENT_TIMESTAMP)
      `, [randomUUID(), replyId, user.userId]);
      
      await db.run('UPDATE forum_replies SET like_count = like_count + 1 WHERE id = ?', [replyId]);
      
      res.json({
        success: true,
        message: 'Reply liked',
        data: { liked: true }
      });
    }

  } catch (error) {
    console.error('Like reply error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Report content (posts or replies)
router.post('/reports', authenticate, async (req: express.Request, res: express.Response) => {
  try {
    const validation = reportSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: 'Invalid report data',
        errors: validation.error.issues
      });
    }

    const user = req.user!;
    const db = getDb(req);
    const data = validation.data;

    // Verify target exists
    const tableName = data.target_type === 'post' ? 'forum_posts' : 'forum_replies';
    const target = await db.get(
      `SELECT id, user_id FROM ${tableName} WHERE id = ?`,
      [data.target_id]
    );

    if (!target) {
      return res.status(404).json({
        success: false,
        message: `${data.target_type} not found`
      });
    }

    // Check if user already reported this content
    const existingReport = await db.get(`
      SELECT id FROM forum_reports 
      WHERE target_type = ? AND target_id = ? AND reported_by = ?
    `, [data.target_type, data.target_id, user.userId]);

    if (existingReport) {
      return res.status(400).json({
        success: false,
        message: 'You have already reported this content'
      });
    }

    // Create report
    const reportId = randomUUID();
    await db.run(`
      INSERT INTO forum_reports (
        id, target_type, target_id, reported_by, reason, description,
        status, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, 'pending', CURRENT_TIMESTAMP)
    `, [
      reportId,
      data.target_type,
      data.target_id,
      user.userId,
      data.reason,
      data.description || null
    ]);

    // Auto-escalate certain types of reports
    if (data.reason === 'self_harm' || data.reason === 'harassment') {
      // Create crisis alert for self-harm reports
      if (data.reason === 'self_harm') {
        await db.run(`
          INSERT INTO crisis_alerts (
            user_id, risk_level, risk_score, trigger_type, trigger_data,
            factors, recommendations, requires_immediate_attention,
            detected_by_user_id, status, created_at
          ) VALUES (?, 'high', 65, 'manual', ?, ?, ?, 1, ?, 'new', CURRENT_TIMESTAMP)
        `, [
          target.user_id,
          JSON.stringify({ source: 'forum_report', report_id: reportId }),
          JSON.stringify(['Self-harm content reported by community']),
          JSON.stringify(['Immediate review of forum activity and user welfare check']),
          user.userId
        ]);
      }

      // Flag for immediate moderation
      await db.run(`
        INSERT INTO forum_moderation_log (
          id, target_type, target_id, user_id, action, reason,
          system_flags, created_at
        ) VALUES (?, ?, ?, ?, 'flag', ?, ?, CURRENT_TIMESTAMP)
      `, [
        randomUUID(),
        data.target_type,
        data.target_id,
        user.userId,
        `User reported content for: ${data.reason}`,
        JSON.stringify({ priority: 'high', auto_escalated: true })
      ]);
    }

    res.status(201).json({
      success: true,
      message: 'Content reported successfully',
      data: { reportId }
    });

  } catch (error) {
    console.error('Create report error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get forum statistics (admin/counselor only)
router.get('/statistics', authenticate, requireRole(['admin', 'counselor']), async (req: express.Request, res: express.Response) => {
  try {
    const user = req.user!;
    const db = getDb(req);
    const { period = '30' } = req.query;
    const days = parseInt(period as string);

    // Overall forum activity
    const activityStats = await db.get(`
      SELECT 
        (SELECT COUNT(*) FROM forum_posts WHERE created_at > datetime('now', '-${days} days')) as new_posts,
        (SELECT COUNT(*) FROM forum_replies WHERE created_at > datetime('now', '-${days} days')) as new_replies,
        (SELECT COUNT(DISTINCT user_id) FROM forum_posts WHERE created_at > datetime('now', '-${days} days')) as active_users,
        (SELECT COUNT(*) FROM forum_reports WHERE created_at > datetime('now', '-${days} days')) as new_reports
    `);

    // Category activity
    const categoryStats = await db.all(`
      SELECT 
        fc.name,
        COUNT(fp.id) as post_count,
        COUNT(DISTINCT fp.user_id) as unique_users
      FROM forum_categories fc
      LEFT JOIN forum_posts fp ON fc.id = fp.category_id AND fp.created_at > datetime('now', '-${days} days')
      WHERE fc.is_active = 1
      GROUP BY fc.id, fc.name
      ORDER BY post_count DESC
    `);

    // Moderation statistics
    const moderationStats = await db.get(`
      SELECT 
        COUNT(*) as total_actions,
        COUNT(CASE WHEN action = 'remove' THEN 1 END) as removed_content,
        COUNT(CASE WHEN action = 'flag' THEN 1 END) as flagged_content,
        COUNT(CASE WHEN system_flags LIKE '%auto_escalated%' THEN 1 END) as auto_escalated
      FROM forum_moderation_log 
      WHERE created_at > datetime('now', '-${days} days')
    `);

    // Safety statistics
    const safetyStats = await db.get(`
      SELECT 
        COUNT(CASE WHEN reason = 'self_harm' THEN 1 END) as self_harm_reports,
        COUNT(CASE WHEN reason = 'harassment' THEN 1 END) as harassment_reports,
        COUNT(CASE WHEN status = 'resolved' THEN 1 END) as resolved_reports
      FROM forum_reports 
      WHERE created_at > datetime('now', '-${days} days')
    `);

    // Daily activity trends
    const dailyTrends = await db.all(`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as activity_count
      FROM (
        SELECT created_at FROM forum_posts WHERE created_at > datetime('now', '-${days} days')
        UNION ALL
        SELECT created_at FROM forum_replies WHERE created_at > datetime('now', '-${days} days')
      ) combined_activity
      GROUP BY DATE(created_at)
      ORDER BY date DESC
      LIMIT 30
    `);

    res.json({
      success: true,
      data: {
        period: `${days} days`,
        activityOverview: activityStats,
        categoryBreakdown: categoryStats,
        moderationSummary: moderationStats,
        safetySummary: safetyStats,
        dailyTrends: dailyTrends.reverse()
      }
    });

  } catch (error) {
    console.error('Get forum statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Moderation actions (admin/counselor only)
router.post('/moderate', authenticate, requireRole(['admin', 'counselor']), async (req: express.Request, res: express.Response) => {
  try {
    const validation = moderationActionSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: 'Invalid moderation data',
        errors: validation.error.issues
      });
    }

    const user = req.user!;
    const db = getDb(req);
    const data = validation.data;

    // Verify target exists
    const tableName = data.target_type === 'post' ? 'forum_posts' : 'forum_replies';
    const target = await db.get(`SELECT id, status FROM ${tableName} WHERE id = ?`, [data.target_id]);

    if (!target) {
      return res.status(404).json({
        success: false,
        message: `${data.target_type} not found`
      });
    }

    // Execute moderation action
    let updateQuery = '';
    let updateParams: any[] = [];

    switch (data.action) {
      case 'approve':
        updateQuery = `UPDATE ${tableName} SET status = 'published', moderated_at = CURRENT_TIMESTAMP, moderated_by = ? WHERE id = ?`;
        updateParams = [user.userId, data.target_id];
        break;
      case 'remove':
        updateQuery = `UPDATE ${tableName} SET status = 'removed', moderated_at = CURRENT_TIMESTAMP, moderated_by = ? WHERE id = ?`;
        updateParams = [user.userId, data.target_id];
        break;
      case 'pin':
        if (data.target_type === 'post') {
          updateQuery = `UPDATE forum_posts SET is_pinned = 1, moderated_at = CURRENT_TIMESTAMP, moderated_by = ? WHERE id = ?`;
          updateParams = [user.userId, data.target_id];
        }
        break;
      case 'unpin':
        if (data.target_type === 'post') {
          updateQuery = `UPDATE forum_posts SET is_pinned = 0, moderated_at = CURRENT_TIMESTAMP, moderated_by = ? WHERE id = ?`;
          updateParams = [user.userId, data.target_id];
        }
        break;
    }

    if (updateQuery) {
      await db.run(updateQuery, updateParams);
    }

    // Log moderation action
    await db.run(`
      INSERT INTO forum_moderation_log (
        id, target_type, target_id, user_id, action, reason,
        internal_notes, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `, [
      randomUUID(),
      data.target_type,
      data.target_id,
      user.userId,
      data.action,
      data.reason || null,
      data.internal_notes || null
    ]);

    res.json({
      success: true,
      message: `${data.target_type} ${data.action}d successfully`
    });

  } catch (error) {
    console.error('Moderation action error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export default router;