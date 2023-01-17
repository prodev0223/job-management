import React, { useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap';
import ErrorAlert from '../../../components/ErrorAlert';
import LoadingAlert from '../../../components/LoadingAlert';
import { useGetClientsQuery } from '../../../redux/slices/clientsSlice';
import { Client } from '../../../types/clients';
import CreateStep1 from './Create/CreateStep1';
import CreateStep2 from './Create/CreateStep2';
import CreateStep3 from './Create/CreateStep3';

const JobCreateV2 = () => {

    const [step, setStep] = useState(1);

    const { data: clients, isLoading: isLoadingClients, isError: isErrorClients, isSuccess: isSuccessClients, error: errorClients } = useGetClientsQuery(undefined, {
        refetchOnMountOrArgChange: true,
    })

    const [clientFormData, setClientFormData] = useState({
        contactName: "",
        contactEmail: "",
        contactPhone: "",
        client: "",
        streetAddress1: "",
        streetAddress2: "",
        city: "",
        postcode: "",
        state: "",
        country: "",
        description: "",
        dateSubmitted: new Date(),
        followUpDate: new Date(),
        reqDateOfQuote: new Date(),
        doAndCharge: false,
        estimator: "",
        fileReference: "",
        jobStatus: "",
        quoteStatus: "",
        xeroReference: ""
    })

    const nextStep = () => {
        setStep(step + 1);
    };

    const prevStep = () => {
        setStep(step - 1);
    }

    const handleInputData = (input: any) => (e: { target: { value: any; }; }) => {
        const { value } = e.target;

        let doAndCharge: boolean;

        if (input === 'doAndCharge') {

            if (value === 'on' && clientFormData.doAndCharge === false) {
                doAndCharge = true;
            } else {
                doAndCharge = false;
            }


            setClientFormData(prevState => ({
                ...prevState,
                [input]: doAndCharge
            }))
        } else {
            setClientFormData(prevState => ({
                ...prevState,
                [input]: value
            }));

            console.log(clientFormData)

        }
    }

    const handleClientInputData = (input: any) => (e: any) => {

        let value: Client | undefined;

        if (clients) {
            console.log(clients.find(client => client._id === e.value));
            value = clients.find(client => client._id === e.value);
        } else {
            value = e.value;
        }

        setClientFormData(prevState => ({
            ...prevState,
            [input]: value,
        }));
    }

    const handleCustomSelectInputData = (input: any) => (e: any) => {

        let value = e.value;

        setClientFormData(prevState => ({
            ...prevState,
            [input]: value
        }))
    }

    const handleDateInputData = (input: any) => (e: any) => {

        let date = new Date(e);

        console.log('date', date);

        setClientFormData(prevState => ({
            ...prevState,
            [input]: date
        }))


    }

    switch (step) {
        case 1:
            return (
                <React.Fragment>
                    <Container>
                        <Row>
                            <Col>
                                <CreateStep1 nextStep={nextStep} handleFormData={handleClientInputData} values={clientFormData} />
                            </Col>
                        </Row>
                    </Container>
                </React.Fragment>
            )
        case 2:
            return (
                <React.Fragment>
                    <Container>
                        <Row>
                            <Col>
                                <CreateStep2 nextStep={nextStep} prevStep={prevStep} handleFormData={handleInputData} values={clientFormData} />
                            </Col>
                        </Row>
                    </Container>
                </React.Fragment>

            )
        case 3:
            return (
                <React.Fragment>
                    <Container>
                        <Row>
                            <Col>
                                <CreateStep3 nextStep={nextStep} prevStep={prevStep} handleFormData={handleInputData} handleSelectData={handleCustomSelectInputData} handleDateData={handleDateInputData} values={clientFormData} />
                            </Col>
                        </Row>
                    </Container>
                </React.Fragment>
            )
    }

    let content;

    if (isLoadingClients) {
        content = (
            <React.Fragment>
                <LoadingAlert title="Loading Clients" card />
            </React.Fragment>
        )
    } else if (isErrorClients) {
        content = (
            <React.Fragment>
                <ErrorAlert title="Error Loading Clients!" error={JSON.stringify(errorClients, null, 2)} />
            </React.Fragment>
        )
    } else if (isSuccessClients) {
        content = (
            <React.Fragment>
                <div>

                </div>
            </React.Fragment>
        )
    } else {
        content = (
            <div>

            </div>
        )
    }

    return content;
}

export default JobCreateV2
