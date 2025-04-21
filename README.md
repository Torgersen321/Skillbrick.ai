# SkillBrick AI Learning Platform

This project aims to develop SkillBrick, an adaptive, AI-powered learning platform offering personalized educational journeys through modular "learning bricks." Users can customize their learning paths, receive AI-driven feedback, and track their progress across different knowledge levels.

See `PRD_Skillbrickv1.txt` for detailed product requirements (if available).

## Project Structure

- `frontend/`: Contains the React (Vite + TypeScript) frontend application.
- `backend/`: Contains the Node.js (Express + TypeScript) backend application.
- `tasks/`: Contains task definitions managed by `task-master`.
- `.github/workflows/`: Contains GitHub Actions CI workflows.

## Getting Started

### Prerequisites

- Node.js (v18.x or v20.x recommended)
- npm
- Access to a Supabase project (configured via MCP or environment variables)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```
2.  **Install Frontend Dependencies:**
    ```bash
    cd frontend
    npm install
    cd ..
    ```
3.  **Install Backend Dependencies:**
    ```bash
    cd backend
    npm install
    cd ..
    ```
4.  **Environment Variables:**
    - If not using MCP for Supabase, ensure your Supabase URL and Anon Key are set in a `.env` file in the root directory (see `.env.example` if available or add `SUPABASE_URL` and `SUPABASE_ANON_KEY`).

### Running the Application

1.  **Run the Frontend (Development Mode):**
    ```bash
    cd frontend
    npm run dev
    ```
    (Usually runs on `http://localhost:5173`)

2.  **Run the Backend (Development Mode):**
    *(Note: Requires TypeScript compilation setup or using a tool like `ts-node-dev`)*
    ```bash
    cd backend
    # Example using ts-node-dev (install first: npm install -D ts-node-dev typescript @types/node @types/express)
    # npx ts-node-dev src/server.ts
    # OR setup a build and run process in package.json
    npm start # Assuming a start script is configured in backend/package.json
    ```
    (Usually runs on `http://localhost:3001`)

## Development Workflow

This project uses `task-master` for task management. See the [dev_workflow rule](.cursor/rules/dev_workflow.mdc) or run `task-master --help` for commands.

- **List tasks:** `task-master list`
- **Show next task:** `task-master next`
- **Set task status:** `task-master set-status --id=<task_id> --status=<done|pending|...>`
- **Update tasks (AI-driven):** `task-master update --from=<id> --prompt="<description>"`

**Note on AI-driven Updates:** The `task-master update` command uses an AI (Claude) to modify tasks based on your prompt. While powerful, complex updates involving nested structures (like modifying multiple subtasks at once) may occasionally result in errors if the AI generates invalid JSON. If you encounter persistent JSON parsing errors with `task-master update`:
  - **Verify API Key:** Ensure your `ANTHROPIC_API_KEY` in the root `.env` file is correct and accessible to the shell environment where you run `task-master` (you might need to `source .env` if it's not automatically loaded).
  - **Manual Fallback:** For complex structural changes, it's recommended to manually edit the `tasks/tasks.json` file directly to ensure correctness. The AI update feature works best for simpler modifications like changing descriptions or adding single tasks.
  - **Global Installation:** Note that `task-master` is expected to be globally installed (`npm install -g claude-task-master`). Enhancements to its internal error handling (like logging invalid AI responses or schema validation) would require modifications to the global package itself.

## Database Schema (Supabase)

The core schema resides in the `public` schema of the Supabase project (`bsfnsbmpyopbyeptuhyc`).

- **`profiles`**: Stores public user profile data, linked 1:1 with `auth.users` via the user's UUID.
  - `id` (uuid, PK, FK -> auth.users.id)
  - `current_level` (integer)
  - `created_at`, `updated_at` (timestamptz)
- **`content_items`**: Stores individual learning content units.
  - `id` (uuid, PK)
  - `brick_type` (text)
  - `domain` (text)
  - `topic_hierarchy` (text)
  - `intrinsic_difficulty` (float)
  - `content` (jsonb)
  - `created_at`, `updated_at` (timestamptz)
- **`user_knowledge_states`**: Tracks the relationship and learning progress between a user and a content item.
  - `user_id` (uuid, PK, FK -> profiles.id)
  - `content_id` (uuid, PK, FK -> content_items.id)
  - `mastery_estimate` (float)
  - `memory_strength` (float)
  - `exposure_count` (integer)
  - `correct_count` (integer)
  - `last_interaction_at` (timestamptz)
  - `next_review_due_at` (timestamptz, nullable)
  - `created_at`, `updated_at` (timestamptz)

See the migration files or Supabase dashboard for full details, constraints, indexes, and RLS policies.