function Form({
  formType,
  handleInputChange,
  formData,
  handleSubmit,
  responseMsg,
}) {
  return (
    <>
      {responseMsg && <h2>{responseMsg}</h2>}
      <div className="login">
        <h2>{formType}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>
          <button type="submit">{formType}</button>
        </form>
      </div>
    </>
  )
}

export default Form
