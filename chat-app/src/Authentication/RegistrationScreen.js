import "./authentication.css"

export function RegistrationScreen() {
    return (
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
                <div className="form-group row authentication-row">
                    <div className="col-3">
                        <label htmlFor="validated-password">Please validate your password</label>
                    </div>
                    <div className="col-9">
                        <input type="password" className="form-control" id="validated-password" placeholder="Password" />
                    </div>
                </div>
                <div className="form-group row authentication-row">
                    <div className="col-3">
                        <label htmlFor="display-name">Display name</label>
                    </div>
                    <div className="col-9">
                        <input type="text" className="form-control" id="display-name" placeholder="Username" />
                    </div>
                </div>
                <div className="form-group row authentication-row">
                    <div className="col-3">
                        <label htmlFor="profile-picture">Profile Picture</label>
                    </div>
                    <div className="col-9">
                        <input type="file" className="form-control" id="profile-picture" />
                    </div>
                </div>
                <button className="btn btn-primary">Register</button>
            </form>
            <div className="text-center">
                <p>Already registered? <a href="login.html">click here</a> to login</p>
            </div>
        </div>
    );
}