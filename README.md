# GitGrader

I've moved to gitlab so I can use gitlab's CI to pipeline the work to AWS S3. I have the content hosted on http://panku.io
[Gitlab link](https://gitlab.com/Panku/GitGrader)

The only information "saved" are the `access_token`'s and `host_url`'s that are requried so we can communicate as you to both Canvas and Gitlab. This is a static page so they're saved to your localStorage and that can easily be cleared by you with the `clear` button in the settings.

There is no server side, agian no information is saved on our end.

The purpose of this project is to have a teacher or grader "connect" their Canvas course and have them create a Gitlab group (namespace).
By having these "relationships" `GitGrader` will determine what your "base repositories" are and what are student repositories.

With base repositories you can then `create` all student repositories, `assign` each student to their repositories, `lock/unlock` in case you don't want them to update the projects. Obviously there is the ability to `delete` and then a ability to `nuke`. (Delete base repo and all student repos associated with it.)

All student repos that are made follow a (long) pattern. `year-semester-assignment-section-username`. This helps organize them, helps `GitGrader` determine what student repos are and what base repo each student repo belongs to.

[Here's a short video showing off how it flows.](https://s3.us-east-2.amazonaws.com/gitgrader.panku.io/2020-05-12+12-33-13.mp4)
