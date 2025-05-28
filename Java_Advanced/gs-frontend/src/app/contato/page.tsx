// src/app/contato/page.tsx
'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { FaGithub } from 'react-icons/fa';
import {
    Phone,
    Mail,
    MapPin,
    Clock,
    User,
    AtSign,
    FileText,
    MessageCircle,
    Send
} from 'lucide-react';

// Carregamento Dinâmico do Componente do Mapa
const DynamicLeafletMap = dynamic(() => import('@/components/LeafletMap'), {
    ssr: false,
    loading: () => (
        <div className="flex items-center justify-center w-full h-full bg-slate-700/80 rounded-md"> {/* Fundo para o estado de loading */}
            <p className="text-center text-slate-300 py-4">Carregando mapa...</p>
        </div>
    )
});

interface DeveloperInfo {
    name: string;
    rm: string;
    turma: string;
    githubUser?: string;
    linkedinUser?: string;
    imageUrl?: string;
}

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
    const mapPosition: [number, number] = [-23.4606621, -46.5490878];
    const emailDestino: string = "rm557881@fiap.com.br";

    const developers: DeveloperInfo[] = [
        { name: "Paulo André Carminati", rm: "557881", turma: "2-TDSPZ", githubUser: "carmipa", imageUrl: "https://avatars.githubusercontent.com/u/12540569?v=4" },
        { name: "Arthur Bispo de Lima", rm: "557568", turma: "2-TDSPV", githubUser: "arthurbispo", imageUrl: "https://placehold.co/80x80/7FBCF4/FFF?text=AB" },
        { name: "João Paulo Moreira", rm: "557808", turma: "2-TDSPV", githubUser: "joaomoreira", imageUrl: "https://placehold.co/80x80/8D6EAB/FFF?text=JP" },
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
        if (!emailDestino || emailDestino === "seu_email_de_atendimento@example.com") { // Verificação de segurança
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
        setNomeCompleto(''); setEmailRemetente(''); setAssunto(''); setMensagem('');
    };

    // Card Component estilizado para corresponder ao exemplo
    const Card: React.FC<{ title?: string; icon?: React.ReactNode; children: React.ReactNode; className?: string; titleClassName?: string }> =
        ({ title, icon, children, className = '', titleClassName = '' }) => (
            <div className={`bg-[#0d2438] rounded-xl shadow-xl p-6 md:p-8 ${className}`}> {/* Fundo escuro #0d2438 como no exemplo */}
                {title && (
                    <h2 className={`text-xl font-semibold text-sky-400 mb-5 flex items-center ${titleClassName}`}>
                        {icon && React.cloneElement(icon as React.ReactElement, { className: "mr-2.5 h-5 w-5 text-sky-400" })}
                        {title}
                    </h2>
                )}
                {children}
            </div>
        );

    const InfoItem: React.FC<{icon: React.ReactNode, label: string, value?: string | React.ReactNode, link?: string, breakAll?: boolean}> =
        ({icon, label, value, link, breakAll}) => (
            <div className="flex items-start py-1.5">
                {React.cloneElement(icon as React.ReactElement, { className: "h-4 w-4 text-sky-400 mt-1 mr-3 flex-shrink-0"})} {/* Ícone um pouco menor e cor ajustada */}
                <div>
                    <h3 className="font-medium text-slate-100 text-xs uppercase tracking-wider">{label}</h3>
                    {link ? (
                        <a href={link} target="_blank" rel="noopener noreferrer"
                           className={`mt-0.5 text-slate-300 hover:text-sky-300 transition-colors underline ${breakAll ? 'break-all' : ''} text-sm`}>
                            {value}
                        </a>
                    ) : (
                        <div className={`mt-0.5 text-slate-300 ${breakAll ? 'break-all' : ''} text-sm`}>{value}</div>
                    )}
                </div>
            </div>
        );

    return (
        <>
            <main className="pt-10 pb-20 min-h-screen bg-[#021A2E] text-slate-200"> {/* Fundo principal da página mais escuro */}
                <div className="container mx-auto px-4 max-w-5xl"> {/* Largura máxima reduzida para max-w-5xl */}
                    <h1 className="text-3xl md:text-4xl font-semibold text-white mb-10 text-center flex items-center justify-center">
                        <span className="material-icons-outlined text-sky-400" style={{fontSize: '1.7em', marginRight: '0.5rem'}}>contact_page</span>
                        Entre em Contato
                    </h1>

                    {/* Layout de Grid: 2 colunas em telas médias e grandes, 1 coluna em pequenas */}
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-12 gap-6 md:gap-8">
                        {/* Coluna da Esquerda (md:col-span-1 lg:col-span-5) */}
                        <div className="md:col-span-1 lg:col-span-5 space-y-6">
                            <Card title="Informações de Contato" icon={<Mail />}>
                                <div className="space-y-3">
                                    <InfoItem icon={<Phone />} label="WhatsApp / Telefone" value={contatoTelefoneDisplay} link={linkWhatsapp}/>
                                    <InfoItem icon={<AtSign />} label="Email de Atendimento" value={emailDestino} breakAll />
                                    <InfoItem icon={<MapPin />} label="Endereço" value={<><p>{enderecoLinha1}</p><p>{enderecoLinha2}</p><p>{enderecoLinha3}</p></>} />
                                    <InfoItem
                                        icon={<Clock />}
                                        label="Horário"
                                        value={<><p>{horarioAtendimento1}</p><p>{horarioAtendimento2}</p><p>{horarioAtendimento3}</p></>}
                                    />
                                </div>
                            </Card>

                            <Card title="Desenvolvido por:" icon={<span className="material-icons-outlined">engineering</span>}>
                                <div className="space-y-3">
                                    {developers.map(dev => (
                                        <div key={dev.rm} className="flex items-center space-x-3 p-2.5 bg-slate-800 rounded-lg border border-slate-700">
                                            {dev.imageUrl && <img src={dev.imageUrl} alt={dev.name} className="h-12 w-12 rounded-full object-cover border-2 border-sky-600" onError={(e) => (e.currentTarget.src = 'https://placehold.co/80x80/012A46/FFF?text=??')} />}
                                            <div className="text-xs">
                                                <p className="font-semibold text-slate-100 text-sm">{dev.name}</p>
                                                <p className="text-slate-400">RM: {dev.rm} - Turma: {dev.turma}</p>
                                                {dev.githubUser && (
                                                    <a href={`https://github.com/${dev.githubUser}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sky-500 hover:text-sky-400 transition-colors text-xs mt-0.5">
                                                        <FaGithub className="h-3 w-3 mr-1" /> GitHub
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    <a href={projectRepoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center text-sky-400 hover:text-sky-300 transition-colors mt-3 text-xs p-2 bg-slate-800 rounded-md hover:bg-slate-700 border border-slate-700">
                                        <FaGithub className="h-3.5 w-3.5 mr-1.5" /> Repositório do Projeto
                                    </a>
                                </div>
                            </Card>
                        </div>

                        {/* Coluna da Direita (md:col-span-2 lg:col-span-7) */}
                        <div className="md:col-span-2 lg:col-span-7 space-y-6 md:space-y-8">
                            <Card title="Envie uma Mensagem (via Webmail)" icon={<span className="material-icons-outlined">forum</span>}>
                                <form className="space-y-4" onSubmit={handleSubmitEmail}>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="nomeCompleto" className="block text-xs font-medium text-slate-300 mb-1 flex items-center">
                                                <User className="mr-2 text-slate-400 h-3.5 w-3.5" /> Nome Completo <span className="text-red-400 ml-1">*</span>
                                            </label>
                                            <input id="nomeCompleto" name="nomeCompleto" type="text" required placeholder="Seu nome completo" className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md focus:ring-1 focus:ring-sky-500 text-white placeholder-slate-400 transition-colors text-sm" value={nomeCompleto} onChange={(e) => setNomeCompleto(e.target.value)} />
                                        </div>
                                        <div>
                                            <label htmlFor="emailRemetente" className="block text-xs font-medium text-slate-300 mb-1 flex items-center">
                                                <AtSign className="mr-2 text-slate-400 h-3.5 w-3.5" /> Seu Email (para resposta) <span className="text-red-400 ml-1">*</span>
                                            </label>
                                            <input id="emailRemetente" name="emailRemetente" type="email" required placeholder="seu.email@exemplo.com" className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md focus:ring-1 focus:ring-sky-500 text-white placeholder-slate-400 transition-colors text-sm" value={emailRemetente} onChange={(e) => setEmailRemetente(e.target.value)} />
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="assunto" className="block text-xs font-medium text-slate-300 mb-1 flex items-center">
                                            <FileText className="mr-2 text-slate-400 h-3.5 w-3.5" /> Assunto <span className="text-red-400 ml-1">*</span>
                                        </label>
                                        <input id="assunto" name="assunto" type="text" required placeholder="Assunto da sua mensagem" className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md focus:ring-1 focus:ring-sky-500 text-white placeholder-slate-400 transition-colors text-sm" value={assunto} onChange={(e) => setAssunto(e.target.value)} />
                                    </div>
                                    <div>
                                        <label htmlFor="mensagem" className="block text-xs font-medium text-slate-300 mb-1 flex items-center">
                                            <MessageCircle className="mr-2 text-slate-400 h-3.5 w-3.5" /> Mensagem <span className="text-red-400 ml-1">*</span>
                                        </label>
                                        <textarea id="mensagem" name="mensagem" rows={5} required placeholder="Digite sua mensagem aqui..." className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md focus:ring-1 focus:ring-sky-500 text-white placeholder-slate-400 transition-colors text-sm" value={mensagem} onChange={(e) => setMensagem(e.target.value)} />
                                    </div>
                                    {formStatus && (
                                        <p className={`text-xs p-2.5 rounded-md ${formStatus.type === 'success' ? 'bg-green-600/30 text-green-200 border border-green-500' : 'bg-red-600/30 text-red-200 border border-red-500'}`}>
                                            {formStatus.message}
                                        </p>
                                    )}
                                    <div className="text-right pt-1">
                                        <button type="submit" className="inline-flex items-center px-5 py-2.5 font-medium text-white bg-sky-600 rounded-md shadow-md hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-150 ease-in-out hover:shadow-lg active:bg-sky-800 disabled:opacity-50 text-sm">
                                            <Send className="mr-2 h-3.5 w-3.5" /> Abrir no Gmail para Enviar
                                        </button>
                                    </div>
                                </form>
                            </Card>

                            <Card title="Nossa Localização (FIAP Aclimação - Exemplo)" icon={<MapPin />}>
                                {/* Container do mapa com altura explícita e fundo para depuração */}
                                <div className="w-full h-[380px] rounded-lg overflow-hidden border border-slate-700 bg-slate-800"> {/* Fundo para depuração */}
                                    <DynamicLeafletMap
                                        position={mapPosition}
                                        markerText={`FIAP Aclimação: ${enderecoLinha1}`}
                                        className="h-full w-full" // Garante que o mapa preencha este div
                                    />
                                </div>
                                <p className="text-xs text-slate-400 mt-2.5 text-center">
                                    {`${enderecoLinha1}, ${enderecoLinha2} - ${enderecoLinha3}`}
                                </p>
                            </Card>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
