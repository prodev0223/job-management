import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";

import { Alert, Card, Container, Dropdown } from "react-bootstrap";

import usePalette from "../../hooks/usePalette";
import useAppSelector from "../../hooks/useAppSelector";
import { Job } from "../../types/jobs";
import dayjs from "dayjs";
import useAppDispatch from "../../hooks/useAppDispatch";
import _ from "lodash";
import { useGetJobsQuery } from "../../redux/slices/jobsSlice";
import ErrorAlert from "../../components/ErrorAlert";
import LoadingAlert from "../../components/LoadingAlert";






const JobsCurrent = () => {
  const palette = usePalette();
  const dispatch = useAppDispatch();

  const { data: jobs, isLoading, isSuccess, isError, error } = useGetJobsQuery();

  let content;

  if (isLoading) {
    content = (
      <LoadingAlert title="Loading Jobs..." />
    )
  } else if (isSuccess) {
    const getJobsInMonthData = (jobs: Job[], status: string[]) => {
      let months = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      for (let i = 0; i < 12; i++) {
        Object.values(jobs).forEach(job => {
          if (_.includes(status, job.jobStatus?.status)) {
            if (dayjs(job.dateSubmitted).month() === i && dayjs(job.dateSubmitted).year() === dayjs().year()) {
              months[i]++;
            }
          }
        })
      }

      return months;

    }

    const getJobsClosedInMonthData = (jobs: Job[], status: string[]) => {
      let months = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      for (let i = 0; i < 12; i++) {
        Object.values(jobs).forEach(job => {
          if (_.includes(status, job.jobStatus?.status)) {
            if (dayjs(job?.completedDate).month() === i && dayjs(job?.completedDate).year() === dayjs().year()) {
              months[i]++;
            }
          }
        })
      }

      return months;

    }

    //@ts-ignore
    const currentJobsData = getJobsInMonthData(jobs, ['Open', 'In Progress', 'Pending', 'Approved', 'Closed', 'Completed']);
    //@ts-ignore
    const completedJobsData = getJobsClosedInMonthData(jobs, ['Closed', 'Completed']);

    const data = {
      labels: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      datasets: [
        {
          label: "Completed",
          backgroundColor: palette.secondary,
          // borderColor: palette.secondary,
          // borderDash: [4, 4],
          data: completedJobsData,
        },
        {
          label: "Created",
          backgroundColor: palette.primary,
          // borderColor: palette.primary,
          //@ts-ignore
          data: currentJobsData,
        },
      ],
    };

    const options = {
      maintainAspectRatio: false,
      cornerRadius: 15,
      legend: {
        display: true,
        position: 'bottom' as const
      },
      plugins: {
        filler: {
          propagate: false,
        },
      },
      scales: {
        yAxes: [
          {
            gridLines: {
              display: false,
            },
            ticks: {
              stepSize: 10,
            },
            stacked: false,
          },
        ],
        xAxes: [
          {
            gridLines: {
              color: "transparent",
            },
            stacked: false,
          },
        ],
      },
    };

    content = (
      <Card className="flex-fill w-100">
        <Card.Header>
          <Card.Title className="mb-0">Jobs Created / Completed by Month</Card.Title>
        </Card.Header>
        <Card.Body className="d-flex">
          <div className="align-self-center w-100">
            <div className="chart chart-lg">
              <Line data={data} options={options} />
            </div>
          </div>
        </Card.Body>
      </Card>
    )
  } else if (isError) {
    content = (
      <ErrorAlert title="Jobs Loading Error!" error={JSON.stringify(error ? error : '')} />
    )
  } else {
    content = (
      <LoadingAlert title="Jobs Loading..." />
    )
  }

  return content;
};

export default JobsCurrent;
