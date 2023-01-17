import { Card, Spinner } from "react-bootstrap"
import { Helmet } from "react-helmet-async"
import Loader from "./Loader"


const LoadingAlert = ({ title, card }: { title: string, card?: boolean }) => {

    let content;

    if (card) {
        content = (
            <>
                <Helmet title={title} />
                <Card className="flex-fill w-100">
                    <Card.Header>
                        <Card.Title className="mb-0">{title}</Card.Title>
                        <Loader />
                    </Card.Header>
                </Card>
            </>
        )
    } else {
        content = (
            <>
                <Helmet title={title} />
                <Spinner animation="border" variant="primary" />

            </>
        )
    }
    return content;
}

export default LoadingAlert