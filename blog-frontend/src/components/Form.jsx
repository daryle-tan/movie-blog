import { Form as BootstrapForm, Button, Alert } from "react-bootstrap"

function Form({
  formType,
  handleInputChange,
  formData,
  handleSubmit,
  responseMsg,
}) {
  return (
    <>
      {responseMsg && (
        <Alert
          variant={responseMsg.includes("successful") ? "success" : "danger"}
          className="mt-3"
        >
          {responseMsg}
        </Alert>
      )}
      <div className="login">
        {/* <h2 className="mb-4">{formType}</h2> */}
        <BootstrapForm onSubmit={handleSubmit}>
          <BootstrapForm.Group className="mb-3" controlId={`${formType}Email`}>
            <BootstrapForm.Label>Email</BootstrapForm.Label>
            <BootstrapForm.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter email"
              required
            />
          </BootstrapForm.Group>

          <BootstrapForm.Group
            className="mb-3"
            controlId={`${formType}Password`}
          >
            <BootstrapForm.Label>Password</BootstrapForm.Label>
            <BootstrapForm.Control
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter password"
              required
            />
          </BootstrapForm.Group>

          <Button variant="primary" type="submit" className="w-100">
            {formType}
          </Button>
        </BootstrapForm>
      </div>
    </>
  )
}

export default Form
