import Link from "next/link";

export default function Login(){
    //     function MyForm() {
//         // const [name, setName] = useState("");

//         // const handleSubmit = (event) => {
//         //     event.preventDefault();
//         //     alert(`The name you entered was: ${name}`)
//     }
//   }

//     function checkValidUser() {
//         //check user information against database
//         //if valid then login 
//         //otherwise, give warning that information is not valid
//     }
    return(
        <>
            <div className="Registration text-center">
                <h1>Login</h1>
                <form>
                    <label className = "container-md">
                        <p>Username</p>
                        <input type="text" name="username" />         
                    </label>
                    <label className = "container-md">
                        <p>Password</p>
                        <input type="text" name="password" />         
                    </label>

                    <div className = "container-sm">
                        <input type="submit" value="Login" />

                    </div>


                </form>               
                <p>Don't yet have an account? Register <Link href="/Registration">here</Link></p>

            </div>
        </>
    );
}