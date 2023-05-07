import "./authentication.css"

export function LoginScreen(props) {
    return (
        <div>
          <title>Login</title>

          <div className="container pane">
            <form>
              <div className="form-group row authentication-row">
                <div className="col-3">
                  <label htmlFor="username">Username</label>
                </div>
                <div className="col-9">
                  <input type="text" className="form-control" id="Username" placeholder="Username" />
                </div>
              </div>
              <div className="form-group row authentication-row">
                <div className="col-3">
                  <label htmlFor="user-password">Password</label>
                </div>
                <div className="col-9">
                  <input type="password" className="form-control" id="user-password" placeholder="Password" />
                </div>
              </div>
              <button className="btn btn-primary">Login</button>
            </form>
            <div className="text-center">
              <p>Not registered? <a href="registration.html">click here</a> to register</p>
            </div>
          </div>
        </div>
      );
}