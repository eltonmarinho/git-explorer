import React, { useState, FormEvent, useEffect } from 'react'
import { FiChevronRight } from 'react-icons/fi'
import api from '../../services/api'
import { Link } from 'react-router-dom'

import { Title, Form, Repositories, Error } from './styles'
import logo from '../../assets/logo.svg'

interface Repository {
    full_name:string;
    description: string;
    owner:{
        login: string;
        avatar_url:string;
    }
}

const Dashboard:React.FC = () => {
    const [newRepo, setNewRepo] = useState('')
    const [inputError, setInputError] = useState('')
    const [repositories, setRepositories] = useState<Repository[]>(()=>{
        const storagedRepositories = localStorage.getItem('@GithubExplorer:repositories')

        if (storagedRepositories){
            return JSON.parse(storagedRepositories)
        }else{
            return []
        }
    })

    

    

    useEffect(()=>{
        localStorage.setItem(
            '@GithubExplorer:repositories', JSON.stringify(repositories),
        )
    }, [repositories])

    async function handleAddRepository(event: FormEvent<HTMLFormElement> ) {
        event.preventDefault()

        if(!newRepo){
            setInputError('type the author/name repository')
            return;
        }

        try{
            const response = await api.get<Repository>(`repos/${newRepo}`)

            const repository = response.data
            setRepositories([...repositories, repository])
            setNewRepo('')
            setInputError('')
        }catch (err){
            setInputError('error to find the repository')
            
        }
        
        
        
        

        // adicao de novo repo
        // consumir api no Github
        // salvar novo repo
    }

    return (
        <>
            <img src={logo} alt="Github Explorer"/>
            <Title>Explore Repositories on Github</Title>

            <Form hasError={!!inputError} onSubmit={handleAddRepository}>
                <input value={newRepo} onChange={e => setNewRepo(e.target.value)} type="text" placeholder='Type repository name'/>
                <button type="submit">Search</button>
            </Form>

            { inputError && <Error>{inputError}</Error>}

            <Repositories>
                {repositories.map(repository => (
                    <Link key={repository.full_name} to={`/repositories/${repository.full_name}`}>
                    <img src={repository.owner.avatar_url} alt={repository.owner.login}/>
                    <div>
                        <strong>{repository.full_name}</strong>
                        <p>{repository.description}</p>
                    </div>
                    <FiChevronRight size={20} />
                </Link>
                ))}
            </Repositories>
        </>
    )
}

export default Dashboard