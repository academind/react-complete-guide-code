# Course Code & Materials

This repository contains the course source code and other extra materials like slides.

## How to use

The code snapshots are organized in multiple **branches** where every branch **represents a course section**.

For example, the branch [01-getting-started](https://github.com/academind/react-complete-guide-code/tree/01-getting-started) holds all code snapshots and extra materials for section 1 of the course ("Getting Started").

You can switch branches via the branch dropdown above the directory explorer.

![Click on the branch dropdown and then select the appropriate branch for the course section you're looking for](./selecting-a-branch.jpg)

In most branches, you'll find multiple folders which organize the section-specific content further:

- Often, you'll find a `/code` subfolder which contains any relevent code snapshots for the given course section
- You also often find `/slides` folders which - guess what - contain the slides for the module
- `/extra-files` typically contains extra files like `.css` files that might be attached to individual lectures in that course module

The folder names should generally be self-explanatory but also feel free to simply click around and see which materials are available.

## Using code snapshots

Code snapshots (which you find in `/code`) are there for you to compare your code to mine and find + fix errors you might have in your code.

You can either view my code directly here on Github (you can open + view code files without issues here) or you download the snapshots.

The subfolders in the `/code` folder are named such that mapping them to the course lectures is straightforward.

### Downloading code snapshots

You can download all the content of a branch via the "Code" button here on Github. You can then either [clone](https://docs.github.com/en/github/creating-cloning-and-archiving-repositories/cloning-a-repository) the repository or simply download the selected branch content as a ZIP file.

**Important:** You always download the **entire branch content!**

You can then dive into the interesting folders (e.g. the individual code snapshots) locally on your hard drive.

### Running the attached code

You can use the attached code simply to compare it to yours. But you can also run it.

To run my code, navigate into a specific code snapshot folder via the `cd` command in your command prompt or terminal first.

Then run `npm install` to install all required dependencies (this will create a `/node_modules` folder).

**Important:** If you're using the code for a module that requires API keys or a backend (e.g. the module about sending Http requests), you'll have to use **your backend URLs** or API keys. Mine won't work (I disabled my projects).