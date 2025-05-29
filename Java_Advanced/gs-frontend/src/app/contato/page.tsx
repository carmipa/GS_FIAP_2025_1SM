// src/app/contato/page.tsx
"use client";

import React, { FormEvent, useState } from "react";
import dynamic from "next/dynamic";
import { FaGithub, FaWhatsapp } from "react-icons/fa";
import {
    User,
    Mail,
    MapPin,
    Briefcase,
    Phone,
    MessageSquare,
    Send,
    ExternalLink,
} from "lucide-react";

const LeafletMap = dynamic(() => import('@/components/LeafletMap'), {
    ssr: false,
    loading: () => <div className="leaflet-container flex items-center justify-center bg-gray-200"><p>Carregando mapa...</p></div>
});

interface TeamMember {
    name: string;
    rm: string;
    email: string;
    githubUser: string;
    githubLink: string;
    turma: string;
    phone: string;
}

const teamMembers: TeamMember[] = [
    {
        name: "Paulo André Carminati",
        rm: "557881",
        email: "rm557881@fiap.com.br",
        githubUser: "carmipa",
        githubLink: "https://github.com/carmipa",
        turma: "2-TDSPZ",
        phone: "(11) 97669-2633",
    },
    {
        name: "Arthur Bispo de Lima",
        rm: "557568",
        email: "rm557568@fiap.com.br",
        githubUser: "ArthurBispo00",
        githubLink: "https://github.com/ArthurBispo00",
        turma: "2-TDSPV",
        phone: "(11) 99145-6219",
    },
    {
        name: "João Paulo Moreira",
        rm: "557808",
        email: "rm557808@fiap.com.br",
        githubUser: "joao1015",
        githubLink: "https://github.com/joao1015",
        turma: "2-TDSPV",
        phone: "(11) 98391-1385",
    },
];

const ContactsPage: React.FC = () => {
    const fiapPaulista: [number, number] = [-23.56177, -46.65878];
    const [formMessage, setFormMessage] = useState<string>('');
    const [formError, setFormError] = useState<string>('');

    const handleContactSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFormError('');
        setFormMessage('');
        console.log("Formulário enviado (simulação)");
        setFormMessage("Mensagem enviada com sucesso! (Simulação)");
        (e.target as HTMLFormElement).reset();
    };

    return (
        <div className="container mx-auto px-4">
            <h1 className="page-title justify-center text-3xl md:text-4xl mb-10 md:mb-12">
                <MessageSquare className="w-8 h-8 md:w-10 md:h-10" /> Conheça a Equipe MetaMind 🧠
            </h1>

            {/* Seção dos Membros da Equipe - AQUI ESTÁ O GRID */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-16">
                {teamMembers.map((member) => (
                    <div key={member.rm} className="team-member-card"> {/* Classe para estilização no globals.css */}
                        <div className="card-content">
                            <h3 className="member-name">
                                <User /> {member.name}
                            </h3>
                            <p className="member-info">
                                <Briefcase /> RM: {member.rm}
                            </p>
                            <p className="member-info">
                                <Mail />
                                <a href={`mailto:${member.email}`} title={`Enviar email para ${member.name}`}>
                                    {member.email}
                                </a>
                            </p>
                            <div className="member-info github-badge-container">
                                <FaGithub /> GitHub:
                                <a href={member.githubLink} target="_blank" rel="noopener noreferrer" className="ml-1" title={`Perfil de ${member.name} no GitHub`}>
                                    <img src={`https://img.shields.io/badge/GitHub-${member.githubUser}-brightgreen?style=flat-square&logo=github`} alt={`GitHub ${member.githubUser} Shield`} />
                                </a>
                            </div>
                            <p className="member-info">
                                <Phone />
                                <a
                                    href={`https://wa.me/55${member.phone.replace(/\D/g, '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title={`Contatar ${member.name} via WhatsApp`}
                                    className="flex items-center"
                                >
                                    {member.phone} <FaWhatsapp className="ml-1 text-green-500" />
                                </a>
                            </p>
                            <p className="member-info mb-0">
                                <Briefcase /> Turma: {member.turma}
                            </p>
                        </div>
                    </div>
                ))}
            </section>

            {/* Seção do Formulário de Contato */}
            <section className="contact-form-section">
                <h2>
                    <MessageSquare /> Entre em Contato Conosco
                </h2>
                <form onSubmit={handleContactSubmit} className="grid grid-cols-1 gap-5">
                    <div className="form-group">
                        <label htmlFor="name">Seu Nome:</label>
                        <input type="text" id="name" name="name" className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" placeholder="Digite seu nome" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Seu Email:</label>
                        <input type="email" id="email" name="email" className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" placeholder="Digite seu email" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="message">Sua Mensagem:</label>
                        <textarea id="message" name="message" rows={5} className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" placeholder="Escreva sua mensagem" required></textarea>
                    </div>

                    {formMessage && <p className="message success">{formMessage}</p>}
                    {formError && <p className="message error">{formError}</p>}

                    <button type="submit" className="button button-primary w-full md:w-auto justify-self-start py-3 px-6">
                        Enviar Mensagem <Send className="ml-2" />
                    </button>
                </form>
            </section>

            {/* Seção do Mapa */}
            <section className="map-section">
                <h2>
                    <MapPin /> Onde Estamos (FIAP Paulista)
                </h2>
                <div className="leaflet-container">
                    <LeafletMap position={fiapPaulista} zoom={17} markerText="MetaMind @ FIAP Paulista" />
                </div>
                <p className="text-muted-text-color mt-3 flex items-center text-sm">
                    <MapPin className="w-4 h-4 mr-1 text-red-500" />
                    Av. Paulista, 1106 - 7º andar - Bela Vista, São Paulo - SP, 01311-000
                </p>
            </section>

            {/* Seção de Links do Projeto */}
            <section className="contact-links-section">
                <p>
                    Acompanhe nosso projeto no GitHub:
                    <a href="https://github.com/carmipa/GS_FIAP_2025_1SM" target="_blank" rel="noopener noreferrer" className="ml-1">
                        <FaGithub /> Visitar Repositório
                    </a>
                </p>
                <p>
                    Saiba mais sobre a Global Solution FIAP:
                    <a href="https://www.fiap.com.br/graduacao/global-solution/" target="_blank" rel="noopener noreferrer" className="ml-1">
                        <ExternalLink /> Página da Global Solution
                    </a>
                </p>
            </section>
        </div>
    );
};

export default ContactsPage;