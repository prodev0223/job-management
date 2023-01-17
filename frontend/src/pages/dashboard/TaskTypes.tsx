import React, { useEffect } from "react";
import { Pie } from "react-chartjs-2";

import { Card, Dropdown } from "react-bootstrap";

import { MoreHorizontal } from "react-feather";

import usePalette from "../../hooks/usePalette";
import useAppDispatch from "../../hooks/useAppDispatch";
import useAppSelector from "../../hooks/useAppSelector";
// import { TaskActions } from "../../utils/api";
import { receivedTasks, useGetTasksQuery } from "../../redux/slices/tasksSlice";
import { faker } from '@faker-js/faker';
import LoadingAlert from "../../components/LoadingAlert";
import ErrorAlert from "../../components/ErrorAlert";

const TaskTypes = () => {
  const palette = usePalette();

  const dispatch = useAppDispatch();
  // const tasks = useAppSelector(state => state.tasks.tasks);

  const { data: tasks, isLoading: isLoadingTasks, isSuccess: isSuccessTasks, isError: isErrorTasks, error: errorTasks } = useGetTasksQuery();


  let content;

  if (isLoadingTasks) {
    content = (
      <>
        <LoadingAlert title="Loading Tasks..." />
      </>
    )
  } else if (isSuccessTasks) {

    if (!tasks) {
      return (
        <ErrorAlert title="Unable to fetch tasks!" error="Error reading tasks.. Refresh page!" />
      )
    }
    const labels = [...new Map(Object.values(tasks).map(item => [item['taskType'], item])).values()]

    //@ts-ignore
    let dataByLabel = [];

    Object.values(labels).forEach(label => {
      let data = tasks && tasks.filter(task => task.taskType === label.taskType)
      dataByLabel.push({ label: label.taskType, length: data.length })
    })

    let colors = [];
    //@ts-ignore
    for (let i = 0; i < Object.values(dataByLabel).length; i++) {
      colors.push(faker.color.rgb())
    }

    const data = {
      labels: ['Fabrication', 'Processing', 'Painting', 'Site Work', 'Detailing', 'Yard', 'Admin - Projects', 'Admin - General', 'Maintenance', 'WHS'],
      datasets: [
        {
          //@ts-ignore
          data: dataByLabel.map(item => item.length),
          backgroundColor: [
            palette.primary,
            palette.warning,
            palette.danger,
            palette["gray-900"],
            palette.info,
            palette.secondary,
            palette.success,
            palette.black,
            palette["primary-dark"],
            '#fc5e03'
          ],
          borderWidth: 5,
          borderColor: palette.white,
        },
      ],
    };

    const options = {
      maintainAspectRatio: true,
      cutoutPercentage: 70,
      legend: {
        display: true,
        position: 'bottom',
      },
    };

    content = (
      <Card className="flex-fill w-100">
        <Card.Header>
          <Card.Title className="mb-0">Tasks by Type</Card.Title>
        </Card.Header>
        <Card.Body className="d-flex">
          <div className="align-self-center w-100">
            <div className="py-3">
              <div className="chart chart-xs">
                <Pie data={data} options={options} />
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
    )
  } else if (isErrorTasks) {
    content = (
      <>
        <ErrorAlert title={errorTasks ? 'Error Loading Tasks...' : 'Unknown Error'} error={JSON.stringify(errorTasks)} />
      </>
    )
  } else {
    content = (
      <>
        <LoadingAlert title="Loading..." />
      </>
    )
  }

  return content;
};

export default TaskTypes;
