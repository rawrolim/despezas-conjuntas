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
    <>
      <div className="row">
        <div className="col-md-6">
          <h2>Sobre o Sistema</h2>
          <p>O Despezas Conjuntas é uma ferramenta inovadora que permite a grupos gerenciar seus salários e dividir as despesas de maneira proporcional. Com uma interface intuitiva e fácil de usar, você pode garantir que todos contribuam de forma justa.</p>
        </div>
        <div className="col-md-6">
          <img src="https://via.placeholder.com/500" alt="Despezas Conjuntas" className="img-fluid" />
        </div>
      </div>
      <div className="row my-4">
        <div className="col-md-4">
          <h3>Fácil de Usar</h3>
          <p>Interface amigável e intuitiva para todos os usuários.</p>
        </div>
        <div className="col-md-4">
          <h3>Divisão Justa</h3>
          <p>Divida as despesas de forma proporcional aos salários.</p>
        </div>
        <div className="col-md-4">
          <h3>Segurança</h3>
          <p>Seus dados estão seguros e protegidos.</p>
        </div>
      </div>
      <div className="col-12 text-center my-4">
        <button className="btn btn-primary btn-lg" onClick={handleLogin}>Comece Agora</button>
      </div>
    </>
  );
}
