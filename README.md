# Asvins Documentation
<aside>
💡 Stack: MERN (MongoDB, Express.js, React, Node.js)
</aside>

## Git commands and pushing and pulling
Right now we are in main, we can pull from main to start working and then push to seperate branch:
Pull Dev Branch

Open VSCode
- Navigate to the root directory of your local repository
- Open local folder on your computer in VSCode
main → local
```bash 
git clone https://github.iu.edu/bkonjeti/Patient-Insurance-Management-System.git
```
## How to run Asvins:
### Setup:

MERN Setup on Local
- make sure you are in ASVINS_MERN

```bash
cd ASVINS_MERN
```


### Run app:

NEW Terminal Window in VSCODE →

Running the BACKEND Node.js and Express Server in terminal:
Navigate to backend folder:
```bash
cd backend
```
Run backend
```bash
node server.js
```
Running FRONTEND React in terminal:
Navigate to frontend folder: cd frontend
```bash
cd frontend
```
```bash
npm install
npm install express
```
Run frontend
```bash
npm start
```
It will ask you to run on a different port, type YES

### Pushing your code:
PUSH TO NEW BRANCH

make changes then ->
main → local -> your branch

```bash 
git checkout -b name-of-branch
```
CONTINUE WORKING BY:
if you make more changes ->
```bash 
git add .
git commit -m "Description of your changes"
git push origin name-of-branch
```

Main branch: we don’t want to push to this until THE END OF THE SPRINT
personal branch: save your current work

main → your branch

Example new branch name: margaret_frontend_login
