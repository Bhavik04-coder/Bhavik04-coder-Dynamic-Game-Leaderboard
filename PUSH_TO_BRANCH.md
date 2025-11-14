# 🌿 Push to Final_code Branch

## Quick Commands

Copy and paste these commands in your terminal:

```bash
# 1. Initialize Git (if not already done)
git init

# 2. Add all files
git add .

# 3. Commit your changes
git commit -m "Final code: Complete gaming leaderboard with RBT"

# 4. Create and switch to Final_code branch
git checkout -b Final_code

# 5. Add remote repository (replace YOUR_USERNAME and REPO_NAME)
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# 6. Push to Final_code branch
git push -u origin Final_code
```

---

## If Repository Already Exists

If you already have a GitHub repository and just want to push to the `Final_code` branch:

```bash
# 1. Make sure you're in your project folder
cd path/to/your/project

# 2. Add all changes
git add .

# 3. Commit changes
git commit -m "Final code: Complete gaming leaderboard with RBT"

# 4. Create and switch to Final_code branch
git checkout -b Final_code

# 5. Push to Final_code branch
git push -u origin Final_code
```

---

## If You Already Have Commits on Main

If you've already committed to main and want to create Final_code branch:

```bash
# 1. Create Final_code branch from current state
git checkout -b Final_code

# 2. Push the new branch
git push -u origin Final_code
```

---

## Verify Your Branch

After pushing, verify on GitHub:

1. Go to your repository on GitHub
2. Click the branch dropdown (says "main" by default)
3. You should see "Final_code" in the list
4. Click it to view your code in that branch

---

## Switch Between Branches

```bash
# Switch to main branch
git checkout main

# Switch to Final_code branch
git checkout Final_code

# See all branches
git branch -a
```

---

## Update Final_code Branch Later

```bash
# Make sure you're on Final_code branch
git checkout Final_code

# Add changes
git add .

# Commit
git commit -m "Updated features"

# Push
git push
```

---

## Set Final_code as Default Branch (Optional)

On GitHub:
1. Go to repository → Settings
2. Click "Branches" in left sidebar
3. Under "Default branch", click the switch icon
4. Select "Final_code"
5. Click "Update"

---

## 🎯 Complete Example

Replace `YOUR_USERNAME` and `YOUR_REPO` with your actual values:

```bash
git init
git add .
git commit -m "Final code: Dynamic Gaming Leaderboard"
git checkout -b Final_code
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin Final_code
```

---

## ✅ Success!

Your code is now on the `Final_code` branch!

View it at: `https://github.com/YOUR_USERNAME/YOUR_REPO/tree/Final_code`

---

## 🆘 Troubleshooting

**Error: "remote origin already exists"**
```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
```

**Error: "branch Final_code already exists"**
```bash
# Switch to existing branch
git checkout Final_code

# Or delete and recreate
git branch -D Final_code
git checkout -b Final_code
```

**Error: "Permission denied"**
- Make sure you're logged into GitHub
- Check repository URL is correct
- Use HTTPS URL (not SSH) if you haven't set up SSH keys

---

**Need help? Check GITHUB_SETUP.md for more details!**
