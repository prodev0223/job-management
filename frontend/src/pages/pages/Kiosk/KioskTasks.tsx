import React from 'react'
import { Alert, Button, Card, Col, Row } from 'react-bootstrap';
import { Edit, Edit2 } from 'react-feather';
import { useNavigate, useParams } from 'react-router'
import ErrorAlert from '../../../components/ErrorAlert';
import TasksByUser from '../../../components/kiosk/TasksByUser';
import TasksByUser2 from '../../../components/kiosk/TasksByUser2';
import LoadingAlert from '../../../components/LoadingAlert';
import PaginationTable from '../../../components/PaginationTable';
import { useGetTaskByIdQuery } from '../../../redux/slices/tasksSlice';

const KioskTasks = () => {

    return (
        <TasksByUser2 />
    );
}

export default KioskTasks
