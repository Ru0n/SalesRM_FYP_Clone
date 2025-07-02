# Development Workflow Guide

This document outlines the standard workflow for contributing code to the SFA Platform project. Adhering to this process ensures code quality, consistency, and easier collaboration.

## 1. Version Control (Git)

*   **Repository:** All code resides in the central Git repository (e.g., on GitHub, GitLab, Bitbucket).
*   **Main Branch:** The `main` branch represents the stable, production-ready code. Direct pushes to `main` are typically restricted or prohibited. Releases are tagged on this branch.
*   **Development Branch:** A `develop` branch is used as the primary integration branch for new features. Feature branches are merged into `develop` first. When `develop` is stable and ready for release, it's merged into `main`.
*   **Feature Branches:** All new features, bug fixes, or chores **must** be developed on separate feature branches, created from the `develop` branch.
    *   **Branch Naming Convention:** Use a descriptive prefix and name, often linking to a task/issue ID if applicable.
        *   `feature/TICKET-123-add-tour-program-api`
        *   `bugfix/TICKET-456-login-error-handling`
        *   `chore/setup-linting`
    *   **Branching Point:** Always create new feature branches from the latest `develop` branch to ensure you have the most recent integrated code.

## 2. Development Process Steps

1.  **Assign/Pick Task:** Select an unassigned task from the "To Do" column of the project's Kanban board (e.g., Jira, Trello, GitHub Projects). Assign it to yourself.
2.  **Activate Environment:** Ensure your `conda` environment (`sfa-env` or the specified project environment name) is activated before starting work.
    ```bash
    conda activate sfa-env
    ```
3.  **Update Local Repo:** Before creating a new branch, make sure your local `develop` branch is synchronized with the remote repository.
    ```bash
    git checkout develop
    git pull origin develop
    ```
4.  **Create Feature Branch:** Create a new branch from `develop` using the agreed naming convention.
    ```bash
    git checkout -b feature/TICKET-123-your-feature-name develop
    ```
5.  **Develop:** Implement the required changes for the task.
    *   **Coding Standards:** Adhere to the project's coding standards (PEP 8 for Python, established JS/React style guide). Use linters (`flake8`, `eslint`) to check code automatically.
    *   **Comments:** Write clear comments for complex logic or non-obvious code sections.
    *   **Commits:** Make small, atomic commits frequently. Write clear and concise commit messages using a standard format (e.g., Conventional Commits: `<type>: <subject>`).
        *   Example: `git commit -m "feat(tours): Add POST endpoint for Tour Program creation"`
        *   Example: `git commit -m "fix(auth): Correct password validation logic"`
        *   Example: `git commit -m "refactor(users): Improve user query performance"`
        *   Example: `git commit -m "test(tours): Add unit tests for TP approval logic"`
        *   Example: `git commit -m "docs(readme): Update setup instructions"`
    ```bash
    # Make changes...
    git add <changed_files>
    git commit -m "feat(module): Describe change briefly"
    # Repeat...
    ```
6.  **Test:** Implement and run tests for your changes.
    *   **Backend:** Write unit and integration tests using `pytest` or Django's test runner. Ensure tests cover new logic and edge cases. Run all backend tests and ensure they pass (`pytest` or `python manage.py test`).
    *   **Frontend:** Write component and integration tests using Jest and React Testing Library. Test component rendering, interactions, and state changes. Run all frontend tests and ensure they pass (`npm test` or `yarn test`).
    *   **Manual Testing:** Perform thorough manual testing in the browser to confirm the feature works correctly, handles errors gracefully, and meets UI/UX requirements. Test across different browsers if necessary.
7.  **Update from Develop (Before Creating Pull Request):** Before pushing your completed feature branch and creating a Pull Request, rebase it onto the latest `develop` branch. This incorporates any changes merged into `develop` while you were working, allowing you to resolve conflicts locally.
    ```bash
    # Ensure develop is up-to-date
    git checkout develop
    git pull origin develop

    # Go back to your feature branch
    git checkout feature/TICKET-123-your-feature-name

    # Rebase your changes on top of the latest develop
    git rebase develop
    ```
    *   **Conflict Resolution:** If conflicts occur during the rebase, Git will pause. Edit the conflicted files to resolve the differences, `git add` the resolved files, and continue the rebase with `git rebase --continue`. **Do not create merge commits during a rebase.** If needed, abort with `git rebase --abort`.
8.  **Push Feature Branch:** Push your completed (and potentially rebased) feature branch to the remote repository. Use `-u` on the first push to set the upstream branch. If you rebased after a previous push, you might need to force push (`git push --force-with-lease origin feature/TICKET-123-your-feature-name`), but do this cautiously and ensure you understand the implications.
    ```bash
    git push -u origin feature/TICKET-123-your-feature-name
    # Or if force push needed after rebase:
    # git push --force-with-lease origin feature/TICKET-123-your-feature-name
    ```
9.  **Create Pull Request (PR):**
    *   Navigate to the repository on the hosting platform (GitHub, GitLab, etc.).
    *   Create a new Pull Request (or Merge Request).
    *   **Base Branch:** Set the target branch to `develop`.
    *   **Compare Branch:** Select your feature branch (`feature/TICKET-123-your-feature-name`).
    *   **Title:** Write a clear, informative title summarizing the change. Include the ticket ID if applicable (e.g., `[TICKET-123] Add Tour Program Creation API`).
    *   **Description:** Provide a detailed description of the changes made, the problem solved, how to test it, and link to the relevant Kanban task/issue. Include screenshots or GIFs for UI changes if helpful.
10. **Code Review:**
    *   Request a code review from one or more team members (if applicable).
    *   Reviewers check the code for correctness, adherence to standards, potential bugs, performance issues, and test coverage.
    *   Address any feedback by making changes, committing them, and pushing the updates to your feature branch. The Pull Request will update automatically. Discuss feedback respectfully.
11. **Merge:**
    *   Once the PR is approved and any automated checks (CI tests, linting) pass, a designated maintainer will merge the Pull Request into the `develop` branch. Use the "Squash and Merge" or "Rebase and Merge" strategy if preferred by the team to keep the main branch history clean.
12. **Delete Feature Branch:** After the PR is successfully merged, delete your local and remote feature branches to keep the repository tidy.
    ```bash
    git checkout develop
    git branch -d feature/TICKET-123-your-feature-name
    git push origin --delete feature/TICKET-123-your-feature-name
    ```

## 3. Coding Standards & Linting

*   **Python (Backend):**
    *   Follow **PEP 8** strictly.
    *   Use **Black** for automatic code formatting.
    *   Use **Flake8** (with plugins like `flake8-bugbear`, `flake8-isort`) for linting.
    *   Configuration files (`pyproject.toml`, `.flake8`) should define the project standards.
*   **JavaScript/React (Frontend):**
    *   Follow a consistent style guide (e.g., Airbnb JavaScript Style Guide).
    *   Use **Prettier** for automatic code formatting.
    *   Use **ESLint** with relevant plugins (React, Hooks, Accessibility) for linting.
    *   Configuration files (`.prettierrc`, `.eslintrc.js`) should define the project standards.
*   **Automation:** Configure linters and formatters to run automatically (e.g., pre-commit hooks using `pre-commit`, IDE integrations, CI checks).

## 4. Testing Strategy

*   **Test Pyramid:** Emphasize a larger base of unit tests, fewer integration tests, and even fewer end-to-end tests.
*   **Backend (Django):**
    *   **Unit Tests:** Test models, forms, serializers, utility functions, and simple view logic in isolation. Use `pytest`. Mock external dependencies.
    *   **Integration Tests:** Test API endpoints thoroughly using `pytest` and DRF's `APIClient`. Verify CRUD operations, permissions, validation, business logic workflows, and database state changes.
*   **Frontend (React):**
    *   **Unit Tests:** Test utility functions, custom hooks, and simple presentational components using Jest.
    *   **Component Tests:** Test individual components using Jest and React Testing Library (`RTL`). Verify rendering based on props, basic user interactions (clicks, typing), and state updates within the component. Mock child components or API calls where necessary.
    *   **Integration Tests:** Test interactions between multiple components, routing changes, and state management updates using RTL. Mock API calls using tools like Mock Service Worker (`msw`).
*   **Coverage:** Aim for meaningful test coverage of critical paths and business logic, rather than just a high percentage number. Use coverage tools (`pytest-cov`, Jest's `--coverage`) to identify untested areas.
*   **Requirement:** New features and bug fixes should ideally be accompanied by relevant automated tests.