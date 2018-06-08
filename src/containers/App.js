import React, { Component } from 'react';
import './App.css';
import todo from './primary-todo.svg';

import tasks from '../tasks'; // the data!
import TaskGroupList from '../components/TaskGroupList';
import TaskList from '../components/TaskList';

import Log from '../Utils/Utils';

class App extends Component {

  /* Iterates over the payload and creates groups for the components to consume.  Each entry in the array is a group of tasks.
  We also determine the "lock" status of each task.

                Example:
                [
                  {
                    groupName: "Purchases",
                    groupTasks: {
                      id: 1,
                      group: "Purchases",
                      task: "Go to the bank",
                      dependencyIds: [],
                      completedAt: null,
                      },
                      {
                        id: 2,
                        group: "Purchases",
                        task: "Buy hammer",
                        dependencyIds: [1],
                        completedAt: null,
                      }
                    }
                ]

  */
  buildGroups() {

    let groups = [];

    // determine lock status of each task
    tasks.forEach((task) => {
      if (task.dependencyIds.length === 0){
        task.isLocked = false;
      } else {
        task.isLocked = this.isLocked(task, this.findTaskInSource);
      }

      // build up the groups with their corresponding task lists
      let group = groups.find(gp => gp.groupName === task.group);
      if (group)
      {
        group.groupTasks.push(task);
      }
      else {
        groups.push({
          groupName: task.group,
          groupTasks: [task]
      })}
    });

    return groups;
  };

  // sets the selected task group to display
  onGroupClicked = (groupName) => {
    this.setState({selectedTaskGroupName: groupName});
  }

  /* Updates the given task's state with the following rules:
    1. If the task is locked, nothing happens
    2. If the task is incomplete, completes it
    3. If the task is complete, re-opens it

    Then, we re-evaluate the rest of the tasks statuses as a dependent task may have changed.
  */
  onTaskClicked = (taskId) => {
    //TODO: Let's discuss whether we should just be updating the tasks every time

    let taskGroup = this.state.taskGroups.find( gp => gp.groupName === this.state.selectedTaskGroupName);
    let currentTask = taskGroup.groupTasks.find( t => t.id === taskId);

    if (currentTask.isLocked){
      return false; // no changes allowed
    }

    // If the current task is NOT locked, toggle it's completion status.
    if (!this.isLocked(currentTask, this.findTaskInState)){
        if (currentTask.completedAt === null) {
          currentTask.completedAt = Date.now();
        } else {
          currentTask.completedAt = null;
        }
    }

    // Arrel, what's the best way to do this?  This can't be the industry standard.
    this.updateAllLockStatus(); // re-evaluate other tasks
    this.setState(this.state);
  }

    /*
    *  Iterate over all the individual tasks and determine their current lock status in regards to task dependencies
    */
    updateAllLockStatus = () => {
    //TODO: Consider for optimization.  For now, we will re-parse all the tasks and make sure they're up to date.
    // Perhaps we should maintain 2-way binding information (parents know of children too?)

      let stateTasksGroups = this.state.taskGroups;
      stateTasksGroups.forEach((group) => {
          group.groupTasks.forEach((task) => {
            task.isLocked = this.isLocked(task, this.findTaskInState.bind(this));
          }, this);
      }, this);

      this.setState({taskGroups:stateTasksGroups });
  }

  // Crawls the dependency tree to determine if the task is locked or if it can be completed
  // findTask: callback to find a task (alternates depending on whether it's the source data (payload) or state)
  isLocked(task, findTask) {
    let parentIds = task.dependencyIds;
    // if the task has no dependencies, it is never locked
    if (task.completedAt || parentIds.length === 0){
      return false;
    }

    // if any parent is incomplete or locked, then this task is locked.
    let someParentLocked = parentIds.some(pId => {
      let parentTask = findTask.call(this,pId);
      if (!parentTask){
        return false; // ignore tasks that aren't found
      }
      return (parentTask.completedAt === null) || this.isLocked(parentTask, findTask);
    });

    return someParentLocked;
  }

  // Iterates all task groups (in state) to find a given task (based on id) and retrieves it
  findTaskInState(taskId){
    let task = null;
    this.state.taskGroups.forEach( taskGroup => {
      let tempTask = taskGroup.groupTasks.find( t => t.id === taskId);
      if(tempTask)
        task = tempTask;
    })
    return task;
  };

  // Iterates all task groups (in source data) to find a given task (based on id) and retrieves it
  findTaskInSource(taskId){
    return tasks.find( t => t.id === taskId);
  };

  constructor() {
      super();

      const groups = this.buildGroups();
      const groupName = groups[0].groupName; // on page load, let's default to first group

      this.state = {
        taskGroups: groups,
        selectedTaskGroupName:groupName // the name of the selected taskGroup
      }

      Log.log('Hello fine people!');
  }

  render() {

    const selectedTaskGroup = this.state.taskGroups.filter((taskGroup) => taskGroup.groupName === this.state.selectedTaskGroupName)[0];

    return (
      <div className="container">
        <header className="App-header row">
          <div className="col">
            <img src={todo} className="App-logo" alt="logo" />
            <span className="App-logo App-header-text text-uppercase">Semi-interesting ToDo List</span>
          </div>
        </header>
        <div className="row">
            <div className="col-sm-5">
              <h4>Things To Do</h4>
              <TaskGroupList taskGroups={this.state.taskGroups} groupClick={this.onGroupClicked}/>
            </div>
            <div className="col-sm-1" />
            <div className="col-sm-6">
              <h4>Task Group</h4>
              <TaskList tasks={selectedTaskGroup.groupTasks} taskClick={this.onTaskClicked} />
            </div>
        </div>


<button data-toggle="collapse" data-target="#demo">Collapsible</button>
<div id="demo" class="collapse">
Lorem ipsum dolor text....
</div>    
        <div>
            <h4>Instructions I was provided for this coding challenge:</h4>
          Create a grouped task list with task dependencies

          <ol class="list-group mb-5">
            <li class="list-group-item">Build a task list UI in React using included design and SVG assets</li>
            <li class="list-group-item"> The top level should show a list of task groups w/ # of tasks inside</li>
            <li class="list-group-item">Clicking a group should display the list of all tasks for that group</li>
            <li class="list-group-item">Tasks remain locked until all dependent tasks are complete</li>
            <li class="list-group-item">Clicking a task should mark it as complete or incomplete, unless the task is locked</li>
            <li class="list-group-item">Dependencies that do not point to a loaded task should be ignored</li>
          </ol>


        </div>
      </div>
    );
  }
}

export default App;
