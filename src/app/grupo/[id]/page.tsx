'use client'
import { addDespesas, deleteDespesa, getGroups } from "@/database/Grupo.database";
import { getUsers } from "@/database/User.database";
import { useUserContext } from "@/hooks/useUserContext";
import Despesa from "@/interfaces/Despesa.interface";
import Grupo from "@/interfaces/Grupo.interface"
import { useRouter } from "next/router";
import { useEffect, useState } from "react"
import { FaDoorOpen, FaPlus, FaRemoveFormat, FaTrash } from "react-icons/fa";
import { FaPersonWalkingArrowRight } from "react-icons/fa6";
import { toast } from "react-toastify";
import { Button, Input } from "reactstrap";

export default function GrupoPage({ params }: { params: Promise<{ id: string }> }) {
    const [group, setGroup] = useState<Grupo>();
    const [valorDespesa, setValorDespesa] = useState(0);
    const [nomeDespesa, setNomeDespesa] = useState("");
    const { user } = useUserContext();
    const [usuarios, setUsuarios] = useState<any[]>([])

    useEffect(() => {
        getCurrentGroup();
    }, [])

    async function getCurrentGroup() {
        const id = (await params).id;
        const groups = await getGroups('');
        const res = groups.find(g => g.id == id);
        if (res) {
            setGroup(res);
            const rs_users = await getUsers();
            const rs_users_filtred = rs_users.filter(u => {
                const uData = u.data();
                return res.users.includes(uData.userId)
            });
            const usersFiltred = rs_users_filtred.map(u => u.data());
            let salarioTotal = 0;
            if (usersFiltred) {
                usersFiltred.map(u => {
                    if (u)
                        salarioTotal += u.salario
                })
                const users = usersFiltred.map(u => {
                    if (u)
                        return {
                            ...u,
                            porcentagem: u.salario / salarioTotal
                        }
                });
                setUsuarios(users)
            }
        }
    }

    async function newDespesa() {
        try {
            if (!nomeDespesa)
                throw new Error("Necessário informar o nome da despesa.");
            if (!valorDespesa)
                throw new Error("Necessário informar o valor da despesa.");
            const id = (await params).id;
            const data = {
                name: nomeDespesa,
                valor: valorDespesa
            };
            await addDespesas(id, data, user.uid);
            setNomeDespesa("");
            setValorDespesa(0);
            getCurrentGroup();
            toast.success("Despesa cadastrada com sucesso!");
        } catch (err: any) {
            toast.error(err.toString());
        }
    }

    async function deleteDespesaHandler(despesa: Despesa){
        try{
            const response = confirm("Deseja realmente deletar a despesa?");
            if(!response)
                return
            const grupoId = (await params).id; 
            await deleteDespesa(grupoId,despesa, user.uid);
            getCurrentGroup();
            toast.success("Despesa deletada com sucesso");
        }catch(err:any){
            toast.error(err.toString());
        }
    }

    return (
        <>
            <div className='col-12 mb-3 d-flex gap-2'>
                <Button color='primary' data-bs-toggle="modal" data-bs-target="#exampleModal">
                    <FaPlus /> Cadastrar Despesa
                </Button>
                <Button color='danger'>
                    <FaDoorOpen /> Sair do grupo
                </Button>
            </div>

            <div className='col-12 col-md-6 p-2'>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Porcentagem</th>
                            <th>Salario</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios && usuarios.map((u, i) => {
                            return (
                                <tr key={i} >
                                    <td>{u.userName}</td>
                                    <td>{(u.porcentagem * 100).toFixed(2)}%</td>
                                    <td>R${u.salario.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>

            <div className='col-12 col-md-6 p-2'>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Despesa</th>
                            <th>Valor</th>
                            {usuarios && usuarios.map((u, i) => {
                                return (
                                    <th key={`th${i}`}>
                                        {u.userName}
                                    </th>
                                )
                            })}
                            <th>Opções</th>
                        </tr>
                    </thead>
                    <tbody>
                        {group && group.despesas && group?.despesas.map((d, i) => {
                            return (
                                <tr key={i} >
                                    <td>{d.name}</td>
                                    <td>R${d.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                    {usuarios && usuarios.map((u, index) => {
                                        return (
                                            <td key={`i-${index}`}>
                                                R${(u.porcentagem * d.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </td>
                                        )
                                    })}
                                    <td><FaTrash style={{cursor:'pointer'}} onClick={()=>deleteDespesaHandler(d)} /></td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>

            <div className="modal fade" id="exampleModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Cadastrar despesa</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body d-flex gap-2">
                            <Input
                                placeholder="Insira o nome da despesa"
                                value={nomeDespesa}
                                onChange={e => setNomeDespesa(e.target.value)}
                            />
                            <Input
                                placeholder="Insira o valor da despesa"
                                value={valorDespesa}
                                type="number"
                                step={0.01}
                                onChange={e => setValorDespesa(Number(e.target.value))}
                            />
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                            <button type="button" className="btn btn-primary" onClick={newDespesa} data-bs-dismiss="modal">Salvar</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}