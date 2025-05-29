'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import {
    Phone,
    Mail,
    MapPin,
    Clock,
    User,
    AtSign,
    FileText,
    MessageCircle,
    Send,
    Contact,
    Github
} from 'lucide-react';

// Dynamic Loading of Map Component to avoid SSR issues with Leaflet
const DynamicLeafletMap = dynamic(() => import('@/components/LeafletMap'), {
    ssr: false,
    loading: () => (
        <div className="flex items-center justify-center w-full h-full rounded-md bg-slate-700/80">
            <p className="text-center text-slate-300 py-4">Carregando mapa...</p>
        </div>
    )
});

interface DeveloperInfo {
    name: string;
    rm: string;
    turma: string;
    githubUser?: string;
    imageUrl?: string;
}

interface CardProps {
    title?: string;
    icon?: React.ReactElement;
    children: React.ReactNode;
    className?: string;
    titleClassName?: string;
}

interface InfoItemProps {
    icon: React.ReactElement;
    label: string;
    value: string | React.ReactNode;
    link?: string;
    breakAll?: boolean;
}

// Card Component with explicit colors for the title
const Card: React.FC<CardProps> = ({ title, icon, children, className = '', titleClassName = '' }) => (
    <div className={`bg-[#0d2438] rounded-lg shadow-xl p-6 md:p-7 ${className}`}>
        {title && (
            <h2 className={`text-xl font-semibold text-sky-400 mb-5 flex items-center ${titleClassName}`}>
                {icon && React.cloneElement(icon, { className: "mr-2.5 h-5 w-5 text-sky-400" })}
                {title}
            </h2>
        )}
        {children}
    </div>
);

// InfoItem Component with explicit colors
const InfoItem: React.FC<InfoItemProps> = ({icon, label, value, link, breakAll}) => {
    return (
        <div className="flex items-start py-1.5">
            {React.cloneElement(icon, { className: "h-4 w-4 text-sky-400 mt-1 mr-3 flex-shrink-0"})}
            <div>
                <h3 className="font-medium text-slate-200 text-xs uppercase tracking-wider">{label}</h3>
                {link ? (
                    <a href={link} target="_blank" rel="noopener noreferrer"
                       className={`mt-0.5 text-sky-400 hover:text-sky-300 transition-colors underline ${breakAll ? 'break-all' : ''} text-sm`}>
                        {value}
                    </a>
                ) : (
                    <div className={`mt-0.5 text-slate-300 ${breakAll ? 'break-all' : ''} text-sm`}>{value}</div>
                )}
            </div>
        </div>
    );
};

export default function ContatoPage() {
    const contatoTelefoneDisplay = "(11) 97669-2633";
    const contatoTelefoneWhatsappNumero = "5511976692633";
    const linkWhatsapp = `https://wa.me/${contatoTelefoneWhatsappNumero}`;
    const enderecoLinha1 = "Rua Laura, 127";
    const enderecoLinha2 = "Vila Leda, Guarulhos - SP";
    const enderecoLinha3 = "CEP: 07062-031";
    const horarioAtendimento1 = "Segunda a Sexta: 10h às 19h";
    const horarioAtendimento2 = "Sábado: 08h às 14h";
    const horarioAtendimento3 = "Domingo: Fechado";
    const mapPosition = [-23.458380, -46.510590];
    const emailDestino = "m557881@fiap.com.br";

    const developers = [
        { name: "Paulo André Carminati", rm: "557881", turma: "2-TDSPZ", githubUser: "carmipa", imageUrl: "https://avatars.githubusercontent.com/u/12540569?v=4" },
        { name: "Gabrielly Macedo", rm: "N/A", turma: "N/A", githubUser: "gabriellymacedo", imageUrl: "https://placehold.co/80x80/7FBCF4/FFF?text=GM" },
    ];
    const projectRepoUrl = "https://github.com/carmipa/GS_FIAP_2025_1SM";

    const [nomeCompleto, setNomeCompleto] = useState('');
    const [emailRemetente, setEmailRemetente] = useState('');
    const [assunto, setAssunto] = useState('');
    const [mensagem, setMensagem] = useState('');
    const [formStatus, setFormStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    const handleSubmitEmail = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setFormStatus(null);

        if (!nomeCompleto || !emailRemetente || !assunto || !mensagem) {
            setFormStatus({ type: 'error', message: "Por favor, preencha todos os campos obrigatórios." });
            return;
        }

        if (!emailDestino || emailDestino === "seu_email_de_atendimento@example.com") {
            setFormStatus({ type: 'error', message: "Erro de configuração: O e-mail de destino não foi definido." });
            return;
        }

        const corpoEmailFormatado = `Nome: ${nomeCompleto}\nE-mail do Remetente (para resposta): ${emailRemetente}\n\nMensagem:\n${mensagem}`;
        const encodedSubject = encodeURIComponent(assunto);
        const encodedBody = encodeURIComponent(corpoEmailFormatado);
        const encodedTo = encodeURIComponent(emailDestino);
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodedTo}&su=${encodedSubject}&body=${encodedBody}`;

        window.open(gmailUrl, '_blank');
        setFormStatus({ type: 'success', message: "Seu cliente de e-mail (Gmail) foi aberto para enviar a mensagem!" });
        setNomeCompleto('');
        setEmailRemetente('');
        setAssunto('');
        setMensagem('');
    };

    // Helper para garantir que os <p> dentro do InfoItem.value tenham a cor correta
    const renderInfoValue = (valueLines: string[]) => (
        <>
            {valueLines.map((line, index) => (
                <p key={index} className="text-slate-300">{line}</p>
            ))}
        </>
    );

    return (
        <main className="pt-10 pb-20 min-h-screen bg-[#021A2E] text-slate-200">
            <div className="container mx-auto px-4 max-w-6xl">
                <h1 className="text-3xl md:text-4xl font-semibold text-sky-300 mb-12 text-center flex items-center justify-center">
                    <Contact className="mr-3 h-8 w-8 text-sky-300" />
                    Entre em Contato
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 mb-6 md:mb-8">
                    <div className="md:col-span-12 lg:col-span-5 space-y-6 md:space-y-8">
                        <Card title="Informações de Contato" icon={<Phone />}>
                            <div className="space-y-3">
                                <InfoItem
                                    icon={<Phone />}
                                    label="WhatsApp / Telefone"
                                    value={contatoTelefoneDisplay}
                                    link={linkWhatsapp}
                                />
                                <InfoItem
                                    icon={<Mail />}
                                    label="Email de Atendimento"
                                    value={emailDestino}
                                    link={`mailto:${emailDestino}`}
                                    breakAll={true}
                                />
                                <InfoItem
                                    icon={<MapPin />}
                                    label="Endereço"
                                    value={renderInfoValue([enderecoLinha1, enderecoLinha2, enderecoLinha3])}
                                />
                                <InfoItem
                                    icon={<Clock />}
                                    label="Horário"
                                    value={renderInfoValue([horarioAtendimento1, horarioAtendimento2, horarioAtendimento3])}
                                />
                            </div>
                        </Card>

                        <Card title="Desenvolvido por" icon={<User />}>
                            <div className="space-y-3">
                                {developers.map(dev => (
                                    <div key={dev.name} className="flex items-center space-x-3 p-2.5 bg-[#0A1F30]/70 rounded-md border border-slate-700/50">
                                        {dev.imageUrl && <img src={dev.imageUrl} alt={dev.name} className="h-10 w-10 rounded-full object-cover border-2 border-sky-500" />}
                                        <div className="text-xs">
                                            <p className="font-semibold text-slate-100 text-sm">{dev.name}</p>
                                            {dev.githubUser && (
                                                <a href={`https://github.com/${dev.githubUser}`}
                                                   target="_blank"
                                                   rel="noopener noreferrer"
                                                   className="inline-flex items-center text-sky-400 hover:text-sky-300 transition-colors text-xs mt-0.5">
                                                    <Github className="h-3 w-3 mr-1 text-sky-400" />
                                                    GitHub
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                <a href={projectRepoUrl}
                                   target="_blank"
                                   rel="noopener noreferrer"
                                   className="flex items-center justify-center text-sky-400 hover:text-sky-300 transition-colors mt-3 text-xs p-2.5 bg-[#0A1F30]/70 rounded-md hover:bg-slate-700/70 border border-slate-700/50">
                                    <Github className="h-3.5 w-3.5 mr-1.5 text-sky-400" />
                                    Repositório do Projeto
                                </a>
                            </div>
                        </Card>
                    </div>

                    <div className="md:col-span-12 lg:col-span-7">
                        <Card title="Envie uma Mensagem (via Webmail)" icon={<MessageCircle />}>
                            <form className="space-y-5" onSubmit={handleSubmitEmail}>
                                <div>
                                    <label htmlFor="nomeCompleto" className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center">
                                        <User className="mr-2 text-slate-400 h-3.5 w-3.5" /> Nome Completo <span className="text-red-400 ml-1">*</span>
                                    </label>
                                    <input
                                        id="nomeCompleto"
                                        name="nomeCompleto"
                                        type="text"
                                        required
                                        placeholder="Seu nome completo"
                                        className="w-full px-3.5 py-2.5 bg-[#0A1F30] border border-slate-600/80 rounded-md focus:ring-1 focus:ring-sky-500 focus:border-sky-500 text-white placeholder-slate-400/70 transition-colors text-sm"
                                        value={nomeCompleto}
                                        onChange={(e) => setNomeCompleto(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="emailRemetente" className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center">
                                        <AtSign className="mr-2 text-slate-400 h-3.5 w-3.5" /> Seu Email (para resposta) <span className="text-red-400 ml-1">*</span>
                                    </label>
                                    <input
                                        id="emailRemetente"
                                        name="emailRemetente"
                                        type="email"
                                        required
                                        placeholder="seu.email@exemplo.com"
                                        className="w-full px-3.5 py-2.5 bg-[#0A1F30] border border-slate-600/80 rounded-md focus:ring-1 focus:ring-sky-500 focus:border-sky-500 text-white placeholder-slate-400/70 transition-colors text-sm"
                                        value={emailRemetente}
                                        onChange={(e) => setEmailRemetente(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="assunto" className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center">
                                        <FileText className="mr-2 text-slate-400 h-3.5 w-3.5" /> Assunto <span className="text-red-400 ml-1">*</span>
                                    </label>
                                    <input
                                        id="assunto"
                                        name="assunto"
                                        type="text"
                                        required
                                        placeholder="Assunto da sua mensagem"
                                        className="w-full px-3.5 py-2.5 bg-[#0A1F30] border border-slate-600/80 rounded-md focus:ring-1 focus:ring-sky-500 focus:border-sky-500 text-white placeholder-slate-400/70 transition-colors text-sm"
                                        value={assunto}
                                        onChange={(e) => setAssunto(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="mensagem" className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center">
                                        <MessageCircle className="mr-2 text-slate-400 h-3.5 w-3.5" /> Mensagem <span className="text-red-400 ml-1">*</span>
                                    </label>
                                    <textarea
                                        id="mensagem"
                                        name="mensagem"
                                        rows={5}
                                        required
                                        placeholder="Digite sua mensagem aqui..."
                                        className="w-full px-3.5 py-2.5 bg-[#0A1F30] border border-slate-600/80 rounded-md focus:ring-1 focus:ring-sky-500 focus:border-sky-500 text-white placeholder-slate-400/70 transition-colors text-sm"
                                        value={mensagem}
                                        onChange={(e) => setMensagem(e.target.value)}
                                    />
                                </div>
                                {formStatus && (
                                    <p className={`text-xs p-2.5 rounded-md ${formStatus.type === 'success' ? 'bg-green-700/40 text-green-200 border border-green-600/70' : 'bg-red-700/40 text-red-200 border border-red-600/70'}`}>
                                        {formStatus.message}
                                    </p>
                                )}
                                <div className="text-right pt-2">
                                    <button
                                        type="submit"
                                        className="inline-flex items-center px-6 py-2.5 font-medium text-sm text-[#021A2E] bg-sky-400 rounded-md shadow-md hover:bg-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-[#0d2438] transition-all duration-150 ease-in-out hover:shadow-lg active:bg-sky-500 disabled:opacity-60"
                                    >
                                        <Send className="mr-2 h-4 w-4" /> Enviar Mensagem
                                    </button>
                                </div>
                            </form>
                        </Card>
                    </div>
                </div>

                <div className="grid grid-cols-1">
                    <Card title="Minha Localização" icon={<MapPin />}>
                        <div className="w-full h-[400px] rounded-md overflow-hidden border border-slate-700/50">
                            <DynamicLeafletMap
                                position={mapPosition}
                                markerText={`${enderecoLinha1}, ${enderecoLinha2}`}
                                className="h-full w-full"
                            />
                        </div>
                        <p className="text-xs text-slate-400 mt-3 text-center">
                            {`${enderecoLinha1}, ${enderecoLinha2} - ${enderecoLinha3}`}
                        </p>
                    </Card>
                </div>
            </div>
        </main>
    );
}