import { Alert, Card } from "react-bootstrap"
import { Helmet } from "react-helmet-async"


const ErrorAlert = ({ title, error }: { title: string, error: string }) => {
    return (
        <>
            <Helmet title={title} />
            <Card className="flex-fill w-100">
                <Card.Header>
                    <Card.Title className="mb-0">{title}</Card.Title>
                    <Alert variant="danger">{error}</Alert>
                </Card.Header>
            </Card>
        </>
    )
}

export default ErrorAlert