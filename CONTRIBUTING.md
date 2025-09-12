# Contributing to NEONEXUS

Thank you for your interest in contributing to NEONEXUS! This document provides guidelines and information for contributors.

## 🌟 Code of Conduct

### Our Commitment
We are committed to creating a welcoming, inclusive, and safe environment for all contributors, especially considering the sensitive nature of mental health support.

### Expected Behavior
- Use welcoming and inclusive language
- Be respectful of differing viewpoints and experiences
- Focus on what is best for the community and users
- Show empathy towards other community members
- Maintain confidentiality and respect privacy concerns

## 🚀 Getting Started

### Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/your-username/neonexus-mental-health-platform.git
   cd neonexus-mental-health-platform
   ```

2. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm start
   ```

3. **Backend Setup** (when available)
   ```bash
   cd backend
   npm install
   npm run dev
   ```

### Development Workflow

1. Create a new branch for your feature/fix
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes following our coding standards
3. Test your changes thoroughly
4. Commit with descriptive messages
5. Push to your fork and create a Pull Request

## 📋 Contribution Types

### 🔧 Code Contributions
- Bug fixes and performance improvements
- New features and enhancements
- UI/UX improvements
- Accessibility enhancements
- Multilingual support

### 📚 Documentation
- API documentation
- User guides and tutorials
- Code comments and inline documentation
- Translation of documentation

### 🎨 Design Contributions
- UI mockups and designs
- Icon and illustration creation
- Accessibility improvements
- Cultural sensitivity reviews

### 🧪 Testing
- Writing unit tests
- Integration testing
- User experience testing
- Accessibility testing

## 📝 Coding Standards

### TypeScript/JavaScript
- Use TypeScript for all new code
- Follow ESLint and Prettier configurations
- Write meaningful variable and function names
- Include JSDoc comments for complex functions
- Use async/await instead of promises where possible

### React Components
```typescript
// Good component structure
interface ComponentProps {
  title: string;
  isVisible?: boolean;
}

const Component: React.FC<ComponentProps> = ({ title, isVisible = true }) => {
  // Component logic here
  return (
    <div className="component-container">
      {isVisible && <h2>{title}</h2>}
    </div>
  );
};

export default Component;
```

### CSS/Styling
- Use Tailwind CSS classes primarily
- Follow mobile-first responsive design
- Maintain the NEONEXUS color palette
- Ensure accessibility (WCAG 2.1 AA)
- Use semantic HTML elements

### Git Commit Messages
Follow the conventional commit format:
```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Examples:
```bash
git commit -m "feat(auth): add multi-language login support"
git commit -m "fix(chatbot): resolve message display issue on mobile"
git commit -m "docs(api): update authentication endpoints"
```

## 🧪 Testing Guidelines

### Frontend Testing
```typescript
// Component testing example
import { render, screen } from '@testing-library/react';
import { MoodCheckIn } from './MoodCheckIn';

describe('MoodCheckIn Component', () => {
  it('should render mood selection options', () => {
    render(<MoodCheckIn />);
    expect(screen.getByText('How are you feeling today?')).toBeInTheDocument();
  });
});
```

### Test Requirements
- Write tests for all new features
- Maintain >80% code coverage
- Include edge cases and error scenarios
- Test accessibility features

## 🌍 Cultural Sensitivity Guidelines

### Language and Content
- Use inclusive and non-stigmatizing language
- Avoid cultural stereotypes or assumptions
- Research cultural context for Indian students
- Include diverse examples and scenarios

### Design Considerations
- Use culturally appropriate colors and symbols
- Consider different reading patterns and preferences
- Ensure content is accessible across different literacy levels
- Include diverse representation in imagery

## 🔍 Pull Request Process

### Before Submitting
- [ ] Code follows style guidelines
- [ ] Tests pass and coverage is maintained
- [ ] Documentation is updated
- [ ] Changes are tested on mobile devices
- [ ] Accessibility is validated
- [ ] Cultural sensitivity is reviewed

### Pull Request Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Other: ___________

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests pass
- [ ] Manual testing completed
- [ ] Accessibility tested

## Cultural Considerations
- [ ] Content reviewed for cultural sensitivity
- [ ] Language usage is inclusive
- [ ] Diverse perspectives considered

## Screenshots (if applicable)
Add screenshots for UI changes

## Additional Notes
Any additional information for reviewers
```

## 🐛 Bug Reports

### Bug Report Template
```markdown
**Bug Description**
Clear description of the bug

**Steps to Reproduce**
1. Go to '...'
2. Click on '....'
3. See error

**Expected Behavior**
What should happen

**Actual Behavior**
What actually happens

**Environment**
- OS: [e.g., Windows 11, macOS, Ubuntu]
- Browser: [e.g., Chrome 91, Safari 14]
- Device: [e.g., Desktop, Mobile, Tablet]
- Screen Size: [if relevant]

**Screenshots**
Add screenshots if helpful
```

## 💡 Feature Requests

### Feature Request Template
```markdown
**Feature Description**
Clear description of the proposed feature

**Problem Statement**
What problem does this solve?

**Proposed Solution**
Detailed description of the solution

**Cultural Considerations**
How does this feature consider diverse user needs?

**Alternatives Considered**
Other solutions you've considered

**Additional Context**
Any additional information
```

## 🏷️ Issue Labels

- `bug`: Something isn't working
- `enhancement`: New feature or request
- `documentation`: Improvements to documentation
- `good first issue`: Good for newcomers
- `help wanted`: Extra attention needed
- `cultural-sensitivity`: Requires cultural review
- `accessibility`: Related to accessibility
- `multilingual`: Translation or language support

## 📞 Getting Help

### Community Support
- GitHub Discussions for questions
- Issue tracker for bugs and features
- Discord/Slack (if available)

### Maintainer Contact
For sensitive issues or major contributions, contact the maintainers directly.

## 🎯 Project Priorities

### Current Focus Areas
1. Core UI components and design system
2. Authentication and user management
3. Chatbot interface development
4. Mobile responsiveness
5. Accessibility improvements

### Future Roadmap
1. Backend API development
2. Database integration
3. AI/ML chatbot implementation
4. Multilingual content translation
5. Advanced analytics dashboard

## 📄 License

By contributing to NEONEXUS, you agree that your contributions will be licensed under the same license as the project (MIT License).

---

Thank you for contributing to NEONEXUS and helping make mental health support more accessible for students! 🌟