'use client'
import { auth, provider } from "@/configs/firebase";
import { createUser } from "@/database/User.database";
import { useUserContext } from "@/hooks/useUserContext";
import User from "@/interfaces/User.interface";
import { signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";
import { Button } from "reactstrap";

export default function Login() {
  const { setUser } = useUserContext();
  const router = useRouter()

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      if (result.user.displayName) {
        let user: User = {
          userName: result.user.displayName,
          userId: result.user.uid,
          salario: 0
        }
        await createUser(user);
      }
      router.push("/home")
    } catch (error) {
      console.error("Erro no login:", error);
    }
  };

  return (
    <div>
      <Button onClick={handleLogin}>Logar</Button>
    </div>
  );
}
