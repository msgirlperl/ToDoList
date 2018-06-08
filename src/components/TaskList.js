import React from 'react';
import Task from './Task'

const TaskList = (props) => {

  const tasks = props.tasks;
  return (
    <div>
      {
        tasks.map((task, i) => {
          return (
            <div className="row group" key={task.id}>
              <div className="col-sm-6">
                <Task taskClick={props.taskClick}
                  task={tasks[i]}
                  id={tasks[i].id}
                  />
                </div>
              </div>
          );
        })
      }
    </div>
  );
}

export default TaskList;
