'use client'
import { addUserOnGroup, createGroup, deleteGroup, getGroups } from "@/database/Grupo.database";
import { useUserContext } from "@/hooks/useUserContext";
import Grupo from "@/interfaces/Grupo.interface";
import moment from "moment";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import { FaPeopleGroup } from "react-icons/fa6";
import { toast } from "react-toastify";
import { Button, ButtonGroup, Input } from "reactstrap";

export default function Grupos() {
    const [grupos, setGrupos] = useState<Grupo[]>([]);
    const { user } = useUserContext();
    const [novoGrupo, setNovoGrupo] = useState("");
    const [cod, setCod] = useState("");
    const router = useRouter();

    async function getGruposUser() {
        const gruposData = await getGroups(user.uid);
        setGrupos(gruposData)
    }

    async function newGroup() {
        if (!novoGrupo) {
            toast.error("Necessário inserir o nome do grupo")
            return
        }
        const group: Grupo = {
            name: novoGrupo,
            users: [user.uid],
            despesas: []
        }
        await createGroup(group);
        setNovoGrupo("");
        getGruposUser();
    }

    async function enterGroup() {
        try {
            if (!cod)
                throw new Error("necessário inserir um código de grupo")
            const groups = await getGroups('');
            const group = groups.find(g => g.id == cod)
            if (!group)
                throw new Error("necessário inserir um código de grupo válido")

            const userOnGroup = group.users.find(u => u == user.uid);
            if (userOnGroup)
                throw new Error("Você já está inserido no grupo atual.")
            await addUserOnGroup(cod, user.uid);
            setCod('');
            await getGruposUser();
        } catch (err: any) {
            toast.error(err.toString());
        }
    }

    async function deleteGroupHandler(id:string){
        try {
            if(!id)
                throw new Error("Erro ao deletar grupo");

            const response = confirm("Tem certeza que deseja deletar o grupo?");
            if(!response)
                return

            await deleteGroup(id);
            await getGruposUser(); 
            toast.success("Grupo deletado com sucesso.");
        } catch (err: any) {
            toast.error(err.toString());
        }
    }

    useEffect(() => {
        getGruposUser()
    }, [])

    return (
        <>
            <div className='col-12 mb-3 d-flex gap-2'>
                <Button color='primary' data-bs-toggle="modal" data-bs-target="#modalEntrar">
                    <FaPeopleGroup /> Entrar em Grupo
                </Button>
                <Button color='primary' data-bs-toggle="modal" data-bs-target="#exampleModal">
                    <FaPlus /> Cadastrar Grupo
                </Button>
            </div>
            <div className="col-12 bg-white rounded border d-flex flex-wrap table-responsive">
                <table className="table table-striped ">
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Nome</th>
                            <th>QTD Usuarios</th>
                            <th>QTD Despesas</th>
                            <th>Data criação</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {grupos && grupos.map((grupo, i) =>
                            <tr className='' key={i}>
                                <td>{grupo.id}</td>
                                <td>{grupo.name}</td>
                                <td>{grupo.users.length}</td>
                                <td>{grupo.despesas.length}</td>
                                <td>{moment(grupo.createdAt).format("DD/MM/YYYY")}</td>
                                <td>
                                    <FaEdit style={{ cursor: 'pointer', marginRight: '5px' }} onClick={() => router.push(`/grupo/${grupo.id}`)} />
                                    <FaTrash style={{ cursor: 'pointer' }} onClick={()=>deleteGroupHandler(grupo.id || "")} />
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>


            <div className="modal fade" id="exampleModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Cadastrar grupo</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <Input
                                placeholder="Insira o nome do grupo"
                                value={novoGrupo}
                                onChange={e => setNovoGrupo(e.target.value)}
                            />
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                            <button type="button" className="btn btn-primary" onClick={newGroup} data-bs-dismiss="modal">Salvar</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="modal fade" id="modalEntrar" tabIndex={-1} aria-labelledby="modalEntrarLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="modalEntrarLabel">Entrar em grupo</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <Input
                                placeholder="Insira o código do grupo"
                                value={cod}
                                onChange={e => setCod(e.target.value)}
                            />
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                            <button type="button" className="btn btn-primary" onClick={enterGroup} data-bs-dismiss="modal">Salvar</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}