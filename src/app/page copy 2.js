'use client'
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { orcamentos, laje } from '../components/dados-orcamento';

const BudgetPresentation = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [includeLaje, setIncludeLaje] = useState(false);
  const [constructionType, setConstructionType] = useState('bloco');
  const [materialsType, setMaterialsType] = useState('bloco');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const projectDetails = {
    title: "Orçamento Detalhado: Construção de Kitnet Estilo Studio ",
    baseArea: "16,49 m² (4,85 m x 3,40 m)",
    expansionArea: "6,8 m² (2 m x 3,40 m)",
    totalArea: "23,29 m²",
    deckArea: "Aproximadamente 2,3m de largura",
    location: "Terreno em morro com dificuldade média elevada",
    temp: "Tempo de execução: 45 a 50 dias",
    laborCost: 28800.00
  };

  const projectStages = [
    {
      stage: "Preparação do Terreno e Fundações",
      details: [
        "Escavação e nivelamento do porão para altura uniforme de 2,50m",
        "Construção de 4 sapatas principais (duas de 1,20m x 1,20m, duas de 1m x 1m)",
        "Execução de colunas de 4m de altura com espigão central nas sapatas maiores",
        "Considerações especiais para estabilidade do terreno em declive"
      ]
    },
    {
      stage: "Estrutura e Contenção",
      details: [
        "Construção de viga de baldrame conectando as colunas",
        "Extensão do muro de pedra para contenção na linha das novas sapatas",
        "Concretagem do piso do porão e execução de contrapiso",
       
      ]
    },
    {
      stage: "Ampliação",
      details: [
        "Construção de duas sapatas adicionais para a extensão de 2m x 3,40m",
        "Execução da estrutura da ampliação (opção entre laje ou estrutura de madeira)",
        "Integração estrutural entre área existente e ampliação",
        
      ]
    },
    {
      stage: "Fechamentos e Divisórias",
      details: [
        "Execução de paredes em bloco ou tijolo no porão",
        "Aplicação de reboco (se tijolo) ou execução de fuga rebaixada (se bloco)",
        "Construção de banheiro e cozinha na área do porão",
        "Fechamento da área de extensão com madeira de pinus tratada",
        "Impermeabilização adequada considerando a umidade do terreno"
      ]
    },
    {
      stage: "Instalações",
      details: [
        "Execução completa de instalações elétricas",
        "Instalação hidráulica para banheiro e cozinha",
        "Instalação de esgoto e caixa de gordura",

      ]
    },
    {
      stage: "Cobertura e Deck",
      details: [
        "Execução do telhado da extensão seguindo o padrão existente",
        "Construção de deck lateral de aproximadamente 2,3m com cobertura",
      ]
    },
    {
      stage: "Acabamentos",
      details: [
        "Instalação de janelas e portas",
        "Assentamento de pisos",
        "Revestimento do banheiro com azulejos",
        "Execução de pintura e acabamentos gerais",
        "Instalação de forro na área do porão",
      ]
    }
  ];

  const calculateTotal = (items) => {
    return items.reduce((total, item) => total + item.valor, 0);
  };

  const getMaterialsBudget = (type) => {
    return type === 'laje' ? laje : orcamentos[type] || [];
  };

  const materialsBudget = getMaterialsBudget(materialsType);
  const materialsTotal = calculateTotal(materialsBudget);
  const lajeTotal = calculateTotal(laje);

  const totalCost = calculateTotal(orcamentos[constructionType]) + projectDetails.laborCost + (includeLaje ? lajeTotal : 0);

  const chartData = [
    { name: 'Materiais', valor: calculateTotal(orcamentos[constructionType]) },
    { name: 'Mão de Obra', valor: projectDetails.laborCost },
    ...(includeLaje ? [{ name: 'Laje', valor: lajeTotal }] : [])
  ];

  const MaterialTypeButtons = ({ onTypeChange, activeType, options }) => (
    <div className="flex flex-wrap justify-start mb-4 gap-2">
      {options.map((option) => (
        <Button
          key={option}
          onClick={() => onTypeChange(option)}
          variant={activeType === option ? 'default' : 'outline'}
          className="transition-all duration-300 ease-in-out"
        >
          {option === 'bloco' ? 'Construção em Bloco' : 
           option === 'tijolo' ? 'Construção em Tijolo' : 
           'Adição de Laje'}
        </Button>
      ))}
    </div>
  );

  const MaterialsTable = ({ materials }) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Item</TableHead>
          <TableHead>Quantidade</TableHead>
          <TableHead>Unidade</TableHead>
          <TableHead>Valor (R$)</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {materials.map((item, index) => (
          <motion.tr
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <TableCell>{item.item}</TableCell>
            <TableCell>{item.quantidade}</TableCell>
            <TableCell>{item.unidade}</TableCell>
            <TableCell>{item.valor.toFixed(2)}</TableCell>
          </motion.tr>
        ))}
      </TableBody>
    </Table>
  );

  const MaterialsCards = ({ materials }) => (
    <div className="space-y-4">
      {materials.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold text-md mb-2">{item.item}</h3>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div>
                  <p className="font-medium">Quantidade</p>
                  <p>{item.quantidade}</p>
                </div>
                <div>
                  <p className="font-medium">Unidade</p>
                  <p>{item.unidade}</p>
                </div>
                <div>
                  <p className="font-medium">Valor (R$)</p>
                  <p>{item.valor.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );

  return (
    <div className="container mx-auto p-4">
      <motion.h1 
        className="text-2xl md:text-3xl lg:text-3xl xl:text-3xl font-bold mb-6 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {projectDetails.title}
      </motion.h1>
      
      <motion.tabs
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      >
        
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        
        <div className="overflow-x-auto">
          <TabsList className="inline-flex w-full sm:w-auto">
            <TabsTrigger value="overview" className="whitespace-nowrap transition-all duration-300 ease-in-out">
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="stages" className="whitespace-nowrap transition-all duration-300 ease-in-out">
              Etapas
            </TabsTrigger>
            <TabsTrigger value="materials" className="whitespace-nowrap transition-all duration-300 ease-in-out">
              Materiais
            </TabsTrigger>
            <TabsTrigger value="summary" className="whitespace-nowrap transition-all duration-300 ease-in-out">
              Resumo
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-semibold">Detalhes do Projeto</h2>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>Área base (porão):</strong> {projectDetails.baseArea}</li>
                  <li><strong>Área de ampliação:</strong> {projectDetails.expansionArea}</li>
                  <li><strong>Área total após ampliação:</strong> {projectDetails.totalArea}</li>
                  <li><strong>Deck lateral:</strong> {projectDetails.deckArea}</li>
                  <li><strong>Localização:</strong> {projectDetails.location}</li>
                  <li><strong>Tempo de execução:</strong> {projectDetails.temp}<br/>
                  <span className='text-xs underline'>O prazo de execução pode sofrer alterações devido a condições climáticas.</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="stages">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-semibold">Etapas de Construção</h2>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {projectStages.map((stage, index) => (
                    <motion.li 
                      key={index} 
                      className="border-b pb-2"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <h3 className="font-semibold">{index + 1}. {stage.stage}</h3>
                      <ul className="list-disc pl-5 mt-2">
                        {stage.details.map((detail, detailIndex) => (
                          <li key={detailIndex} className="text-sm text-gray-600">{detail}</li>
                        ))}
                      </ul>
                    </motion.li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="materials">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-semibold">Orçamento de Materiais</h2>
              </CardHeader>
              <CardContent>
                <MaterialTypeButtons 
                  onTypeChange={setMaterialsType} 
                  activeType={materialsType} 
                  options={['bloco', 'tijolo', 'laje']}
                />
                {isMobile ? (
                  <MaterialsCards materials={materialsBudget} />
                ) : (
                  <div className="overflow-x-auto">
                    <MaterialsTable materials={materialsBudget} />
                  </div>
                )}
                <motion.p 
                  className="mt-4 text-right font-bold"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  Total de Materiais: R$ {materialsTotal.toFixed(2)}
                </motion.p>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="summary">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-semibold">Resumo do Orçamento</h2>
              </CardHeader>
              <CardContent>
                <MaterialTypeButtons 
                  onTypeChange={setConstructionType} 
                  activeType={constructionType} 
                  options={['bloco', 'tijolo']}
                />
                <div className="flex justify-start mb-4">
                  <Button
                    onClick={() => setIncludeLaje(!includeLaje)}
                    variant={includeLaje ? 'default' : 'outline'}
                    className="transition-all duration-300 ease-in-out"
                  >
                    {includeLaje ? 'Remover Laje' : 'Adicionar Laje'}
                  </Button>
                </div>
                <div className="mb-4">
                  <p><strong>Total Materiais ({constructionType}):</strong> R$ {calculateTotal(orcamentos[constructionType]).toFixed(2)}</p>
                  {includeLaje && <p><strong>Total Laje:</strong> R$ {lajeTotal.toFixed(2)}</p>}
                  <p><strong>Mão de Obra:</strong> R$ {projectDetails.laborCost.toFixed(2)}</p>
                  <motion.p 
                    className="text-xl font-bold mt-2"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    Custo Total do Projeto: R$ {totalCost.toFixed(2)}
                  </motion.p>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="valor" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
                <motion.p 
                  className="mt-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  O custo de mão de obra reflete as complexidades e desafios específicos da construção em terreno acidentado. 
                  Isso inclui dificuldades de acesso, necessidade de equipamentos especializados, e medidas adicionais de 
                  segurança, justificando o valor apresentado para garantir a qualidade e segurança da obra.
                </motion.p>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
      </motion.tabs>
    </div>
  );
};

export default BudgetPresentation;