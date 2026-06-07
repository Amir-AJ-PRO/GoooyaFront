"use client"

import { useAgentsList } from '@/hooks/useAgentsList';
import React, { useEffect, useMemo } from 'react'
import PublicAgentCard from './PublicAgentCard';

const AgentHome = () => {
    
    


    // const { data } = useAgentsList();
    // const agents = data?.results ?? [];
    

    return (
        <div className='grid  md:grid-cols-3 grid-cols-2'>


            {/* {agents.slice(0, 3).map((agent, idx) => (
                <div
                    key={agent.id}
                    className="animate-in fade-in slide-in-from-bottom-4"
                    style={{ animationDelay: `${idx * 30}ms` }}
                >
                    <PublicAgentCard agent={agent} />
                </div>
            ))} */}
        </div>
    )
}

export default AgentHome