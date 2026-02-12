import { signOut } from "aws-amplify/auth";
import { useNavigate } from "react-router";

export default function HomePage() {
  const navigate = useNavigate();

  async function handleLogout() {
    await signOut();
    navigate("/login");
  }

  return (
    <div>
      <h1>Home</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
