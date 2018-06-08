import React from 'react';
import TaskGroup from './TaskGroup';

const TaskGroupList = ({ taskGroups, groupClick }) => {

  return (
      <div>
        {
          taskGroups.map((taskGroup, i) => {
            return (
              <TaskGroup
                key={taskGroup.groupName}
                groupName={taskGroups[i].groupName}
                tasks={taskGroups[i].groupTasks}
                groupClick={groupClick}
                />
            );
          })
        }
      </div>
    );
}

export default TaskGroupList;
