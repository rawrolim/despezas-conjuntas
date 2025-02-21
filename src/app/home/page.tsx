"use client"
import { getUserById, updateUser } from "@/database/User.database";
import { useUserContext } from "@/hooks/useUserContext"
import User from "@/interfaces/User.interface";
import { DocumentData } from "firebase/firestore";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaSpinner, FaTruckLoading } from "react-icons/fa";
import { RiLoaderLine } from "react-icons/ri";
import { Input } from "reactstrap";
import style, { keyframes } from 'styled-components'

const spin = keyframes`
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
`;

const Spinner = style(FaSpinner)`
    animation: ${spin} 2s linear infinite;
`

export default function Home() {
    const { user } = useUserContext();
    const [userData, setUserData] = useState<User | DocumentData | undefined>(undefined);
    const [salario, setSalario] = useState(0)
    const [isLoadingSalario, setIsLoadingSalario] = useState(false)

    async function getUserInfos() {
        const res = await getUserById(user.uid);
        if (res) {
            setSalario(res.salario)
            setUserData(res)
        }
    }

    async function updateSalario() {
        setIsLoadingSalario(true);
        const newUserData:any = { ...userData, salario:salario };
        setUserData(newUserData)
        await updateUser(newUserData);
        setIsLoadingSalario(false);
    }

    useEffect(() => {
        getUserInfos()
    }, []);

    useEffect(()=>{
        updateSalario()
    },[salario])

    return (
        <div className="col-12 border shadow rounded p-3 d-flex flex-wrap">
            <div className="col-8">
                <div><label className="fw-bolder">ID:</label> {user.uid}</div>
                <div><label className="fw-bolder">Nome:</label> {user.displayName}</div>
                <div><label className="fw-bolder">E-mail:</label> {user.email}</div>
                <div className="d-flex">
                    <label className="fw-bolder align-self-center me-1">Salario:</label>
                    <Input
                        type='number'
                        className="w-auto"
                        value={salario}
                        placeholder="R$"
                        step={0.01}
                        min={0}
                        onChange={e => setSalario(Number(e.target.value))} />
                    {isLoadingSalario && <Spinner size={20} className="align-self-center ms-2" />}
                </div>
            </div>
            <div className="col">
                <Image src={user.photoURL} alt={""} width={100} height={100} className='rounded-circle' />
            </div>
        </div>
    )
}