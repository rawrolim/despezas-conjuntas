'use client'
import { auth } from "@/configs/firebase";
import { useUserContext } from "@/hooks/useUserContext";
import { useRouter } from "next/navigation";
import { FaUserCircle } from "react-icons/fa";
import { toast } from "react-toastify";

export default function NavComponent() {
    const { user, setUser } = useUserContext();
    const router = useRouter();

    async function logOut() {
        await auth.signOut();
        setUser("");
        toast.success("Usuário deslogado")
        router.push("/");
    }

    return (

        <>
            {user &&
                <nav className="navbar navbar-expand-sm" style={{backgroundColor:'#8bcaa3',color: '#3c5546'}}>
                    <div className="container-fluid">
                        <a className="navbar-brand" onClick={() => router.push("/home")}>
                            Despezas Conjuntas
                        </a>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul className="navbar-nav me-auto mb-2 mb-lg-0 ">
                                <li className="nav-item">
                                    <a className="nav-link active" style={{ cursor: 'pointer' }} onClick={() => router.push("/grupos")}>Grupos</a>
                                </li>
                            </ul>
                            <div className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    Olá, {user.displayName}
                                    <FaUserCircle size={30} className="ms-1" />
                                </a>
                                <ul className="dropdown-menu">
                                    <li><a className="dropdown-item" href="#">Perfil</a></li>
                                    <li><a className="dropdown-item" onClick={logOut}>Sair</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </nav>
            }
        </>
    )
} 