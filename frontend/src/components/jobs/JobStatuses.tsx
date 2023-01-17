import { Badge } from "react-bootstrap";
import { Status } from "../../types/jobs";

const JobStatuses = ({ statusId, statuses, statusName }: { statusId: string, statuses: Status[], statusName?: string }) => {
    if (!statuses) {
        return (
            <Badge bg="warning">Status Not Found</Badge>
        )
    }
    let status = Object.values(statuses).find(sts => sts._id === statusId);

    if (statusName) {
        switch (statusName) {
            case 'New':
                return (
                    <Badge bg="info"><h5 style={{ textDecorationColor: 'white', color: "white", textAlign: "center" }}>New</h5></Badge>
                )
                break;
            case 'In Progress':
                return (
                    <Badge bg="secondary"><h5 style={{ textDecorationColor: 'white', color: "white", textAlign: "center" }}>In Progress</h5></Badge>
                )
            case 'Completed':
                return (
                    <Badge bg="success"><h5 style={{ textDecorationColor: 'white', color: "white", textAlign: "center" }}>Completed</h5></Badge >
                )
        }
    }

    if (status) {
        switch (status.status) {
            case 'Approved':
                return (
                    <Badge bg='info'>{status.status}</Badge>
                )
                break;
            case 'Open':
                return (
                    <Badge bg='info'>{status.status}</Badge>
                )
                break;
            case 'In Progress':
                return (
                    <Badge bg='secondary'>{status.status}</Badge>
                )
                break;
            case 'Pending':
                return (
                    <Badge bg='warning'>{status.status}</Badge>
                )
                break;
            case 'Won':
                return (
                    <Badge bg='success'>{status.status}</Badge>
                )
                break;
            case 'Closed':
                return (
                    <Badge bg='success'>{status.status}</Badge>
                )
                break;
            case 'Completed':
                return (
                    <Badge bg='success'>{status.status}</Badge>
                )
                break;
            case 'Not required':
                return (
                    <Badge bg='danger'>{status.status}</Badge>
                )
                break;
            case 'Not proceeding':
                return (
                    <Badge bg='danger'>{status.status}</Badge>
                )
                break;
            default:
                return (
                    <Badge bg="warning">Status Unkown</Badge>
                )
                break;
        }
    } else {
        return (
            <Badge bg="danger">Status Not Found</Badge>
        )
    }
}

export default JobStatuses