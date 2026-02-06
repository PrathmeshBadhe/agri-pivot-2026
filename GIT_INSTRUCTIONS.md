# How to Push Your Code to GitHub

Your project is already "committed" locally. Now you just need to upload it.

## Step 1: Create the Repo
1.  Go to [github.com/new](https://github.com/new).
2.  Repository name: `agri-pivot-2026` (or whatever you prefer).
3.  **Important**: Do NOT check "Add a README file" or "Add .gitignore". Keep it empty.
4.  Click **Create repository**.

## Step 2: Link and Push
5.  Copy the URL of your new repo (e.g., `https://github.com/YOUR_USERNAME/agri-pivot-2026.git`).
6.  Open your VS Code terminal in the project root (`c:\Users\prath\OneDrive\Documents\cybage tech fest`).
7.  Run these two commands (replace the URL with yours):

```bash
git remote add origin https://github.com/YOUR_USERNAME/agri-pivot-2026.git
git push -u origin main
```

## Success!
Once the push completes, refresh your GitHub page. You should see all your files (Backend, Frontend, Documentation) there.
