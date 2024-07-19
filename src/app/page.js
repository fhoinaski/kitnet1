"use client";
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Button } from "@/components/ui/button";
import {
  orcamentos,
  laje,
  madeira,
  deck,
  pvc,
  telhado,
} from "../components/dados-orcamento";
import SketchupViewer from "@/components/SketchupViewer";

const BudgetPresentation = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [constructionType, setConstructionType] = useState("bloco");
  const [roofType, setRoofType] = useState("laje");
  const [includeDeck, setIncludeDeck] = useState(false);
  const [includePVC, setIncludePVC] = useState(false);
  const [includeRoof, setIncludeRoof] = useState(true);
  const [materialsType, setMaterialsType] = useState("all");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const projectDetails = {
    title:
      "Orçamento Detalhado: Construção de Kitnet Estilo Studio",
    baseArea: "16,49 m² (4,85 m x 3,40 m)",
    expansionArea: "6,8 m² (2 m x 3,40 m)",
    totalArea: "23,29 m²",
    deckArea: "Aproximadamente 2,3m de largura",
    location: "Terreno em morro com dificuldade média elevada",
    laborCost: 28800.0,
  };

  const projectStages = [
    {
      stage: "Preparação do Terreno e Fundações",
      details: [
        "Escavação e nivelamento do porão para altura uniforme de 2,50m",
        "Construção de 4 sapatas principais (duas de 1,20m x 1,20m, duas de 1m x 1m)",
        "Execução de colunas de 4m de altura com espigão central nas sapatas maiores",
        "Considerações especiais para estabilidade do terreno em declive",
      ],
    },
    {
      stage: "Estrutura e Contenção",
      details: [
        "Construção de viga de baldrame conectando as colunas",
        "Extensão do muro de pedra para contenção na linha das novas sapatas",
        "Concretagem do piso do porão e execução de contrapiso",
      ],
    },
    {
      stage: "Ampliação",
      details: [
        "Construção de sapatas adicionais para a extensão de 2m x 3,40m",
        "Execução da estrutura da ampliação (opção entre laje ou estrutura de madeira)",
        "Integração estrutural entre área existente e ampliação",
      ],
    },
    {
      stage: "Fechamentos e Divisórias",
      details: [
        "Execução de paredes em bloco ou tijolo no porão",
        "Aplicação de reboco (se tijolo) ou execução de fuga rebaixada (se bloco) a escolha do cliente",
        "Construção de banheiro e cozinha na área do porão",
        "Fechamento da área de extensão com madeira de pinus tratada",
        "Impermeabilização adequada considerando a umidade do terreno",
      ],
    },
    {
      stage: "Instalações",
      details: [
        "Execução completa de instalações elétricas",
        "Instalação hidráulica para banheiro e cozinha",
        "Instalação de esgoto e caixa de gordura",
      ],
    },
    {
      stage: "Cobertura e Deck",
      details: [
        "Execução do telhado da extensão seguindo o padrão existente",
        "Construção de deck lateral com cobertura em telhado de madeira",
      ],
    },
    {
      stage: "Acabamentos",
      details: [
        "Instalação de janelas e portas",
        "Assentamento de pisos",
        "Revestimento do banheiro com azulejos",
        "Execução de pintura e acabamentos gerais",
        "Instalação de forro na área do porão",
      ],
    },
    {
      stage: "Entrega",
      details: [
        "Limpeza e organização do local",
        "Entrega do imóvel pronto para uso",
        "Acompanhamento pós-obra para garantia de satisfação",
      ],
    },
  ];

  const formatCurrency = (value) => {
    return `R$${value.toFixed(2).replace(".", ",")}`;
  };

  const calculateTotal = (items) => {
    return items.reduce((total, item) => total + item.valor, 0);
  };

  const getMaterialsBudget = (type) => {
    switch (type) {
      case "all":
        return [
          ...orcamentos.bloco,
          ...orcamentos.tijolo,
          ...laje,
          ...madeira,
          ...deck,
          ...pvc,
          ...telhado,
        ];
      case "laje":
        return laje;
      case "madeira":
        return madeira;
      case "deck":
        return deck;
      case "pvc":
        return pvc;
      case "telhado":
        return telhado;
      default:
        return orcamentos[type] || [];
    }
  };

  const materialsBudget = getMaterialsBudget(materialsType);
  const materialsTotal = calculateTotal(materialsBudget);

  const calculateTotalCost = () => {
    let total =
      calculateTotal(orcamentos[constructionType]) + projectDetails.laborCost;
    total += calculateTotal(roofType === "laje" ? laje : madeira);
    if (includeDeck) total += calculateTotal(deck);
    if (includePVC) total += calculateTotal(pvc);
    if (includeRoof) total += calculateTotal(telhado);
    return total;
  };

  const totalCost = calculateTotalCost();

  const chartData = [
    { name: "Materiais", valor: calculateTotal(orcamentos[constructionType]) },
    { name: "Mão de Obra", valor: projectDetails.laborCost },
    {
      name: roofType === "laje" ? "Laje" : "Madeira",
      valor: calculateTotal(roofType === "laje" ? laje : madeira),
    },
    ...(includeDeck ? [{ name: "Deck", valor: calculateTotal(deck) }] : []),
    ...(includePVC ? [{ name: "PVC", valor: calculateTotal(pvc) }] : []),
    ...(includeRoof
      ? [{ name: "Telhado", valor: calculateTotal(telhado) }]
      : []),
  ];

  const MaterialTypeButtons = ({ onTypeChange, activeType, options }) => (
    <div className="flex flex-wrap justify-start mb-4 gap-2">
      {options.map((option) => (
        <Button
          key={option}
          onClick={() => onTypeChange(option)}
          variant={activeType === option ? "default" : "outline"}
        >
          {option.charAt(0).toUpperCase() + option.slice(1)}
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
          <TableHead>Valor</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {materials.map((item, index) => (
          <TableRow key={index}>
            <TableCell>{item.item}</TableCell>
            <TableCell>{item.quantidade}</TableCell>
            <TableCell>{item.unidade}</TableCell>
            <TableCell>{formatCurrency(item.valor)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  const MaterialsCards = ({ materials }) => (
    <div className="space-y-4">
      {materials.map((item, index) => (
        <Card key={index}>
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
                <p className="font-medium">Valor</p>
                <p>{formatCurrency(item.valor)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">
        {projectDetails.title}
      </h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="stages">Etapas</TabsTrigger>
          <TabsTrigger value="materials">Materiais</TabsTrigger>
          <TabsTrigger value="summary">Resumo</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-semibold">Detalhes do Projeto</h2>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Área base (porão):</strong> {projectDetails.baseArea}
                </li>
                <li>
                  <strong>Área de ampliação:</strong>{" "}
                  {projectDetails.expansionArea}
                </li>
                <li>
                  <strong>Área total após ampliação:</strong>{" "}
                  {projectDetails.totalArea}
                </li>
                <li>
                  <strong>Deck lateral:</strong> {projectDetails.deckArea}
                </li>
                <li>
                  <strong>Localização:</strong> {projectDetails.location}
                </li>
              </ul>
            </CardContent>
          </Card>
          <div>
            <SketchupViewer modelUrl="/modelo5.glb" />
          </div>
        </TabsContent>

        <TabsContent value="stages">
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-semibold">Etapas de Construção</h2>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {projectStages.map((stage, index) => (
                  <li key={index} className="border-b pb-2">
                    <h3 className="font-semibold">
                      {index + 1}. {stage.stage}
                    </h3>
                    <ul className="list-disc pl-5 mt-2">
                      {stage.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="text-sm text-gray-600">
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="materials">
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-semibold">Orçamento de Materiais</h2>
            </CardHeader>
            <CardContent>
              <MaterialTypeButtons
                onTypeChange={setMaterialsType}
                activeType={materialsType}
                options={[
                  "all",
                  "bloco",
                  "tijolo",
                  "laje",
                  "madeira",
                  "deck",
                  "pvc",
                  "telhado",
                ]}
              />
              {isMobile ? (
                <MaterialsCards materials={materialsBudget} />
              ) : (
                <div className="overflow-x-auto">
                  <MaterialsTable materials={materialsBudget} />
                </div>
              )}
              <p className="mt-4 text-right font-bold">
                Total de Materiais: {formatCurrency(materialsTotal)}
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="summary">
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-semibold">Resumo do Orçamento</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Tipo de Construção:</h3>
                  <MaterialTypeButtons
                    onTypeChange={setConstructionType}
                    activeType={constructionType}
                    options={["bloco", "tijolo"]}
                  />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Tipo de Cobertura:</h3>
                  <MaterialTypeButtons
                    onTypeChange={setRoofType}
                    activeType={roofType}
                    options={["laje", "madeira"]}
                  />
                </div>
                <div >
                  <h3 className="font-semibold mb-2">Opções Adicionais:</h3>
                  <div className="flex gap-2 text-sm">
                    <Button
                      onClick={() => setIncludeDeck(!includeDeck)}
                      variant={includeDeck ? "default" : "outline"}
                      className="text-sm"	
                    >
                      {includeDeck ? "Tirar Deck" : "Deck"}
                    </Button>
                    <Button
                      onClick={() => setIncludePVC(!includePVC)}
                      variant={includePVC ? "default" : "outline"}
                    >
                      {includePVC ? "Tirar PVC" : "PVC"}
                    </Button>
                    <Button
                      onClick={() => setIncludeRoof(!includeRoof)}
                      variant={includeRoof ? "default" : "outline"}
                    >
                      {includeRoof ? "Tirar Telhado" : "Telhado"}
                    </Button>
                  </div>
                </div>
              </div>
              <div className="mt-6 space-y-2">
                <p>
                  <strong>Total Materiais ({constructionType}):</strong>{" "}
                  {formatCurrency(calculateTotal(orcamentos[constructionType]))}
                </p>
                <p>
                  <strong>
                    Total {roofType === "laje" ? "Laje" : "Madeira"}:
                  </strong>{" "}
                  {formatCurrency(
                    calculateTotal(roofType === "laje" ? laje : madeira)
                  )}
                </p>
                {includeDeck && (
                  <p>
                    <strong>Total Deck:</strong>{" "}
                    {formatCurrency(calculateTotal(deck))}
                  </p>
                )}
                {includePVC && (
                  <p>
                    <strong>Total PVC:</strong>{" "}
                    {formatCurrency(calculateTotal(pvc))}
                  </p>
                )}
                <p>
                  <strong>Mão de Obra:</strong>{" "}
                  {formatCurrency(projectDetails.laborCost)}
                </p>
                <p className="text-xl font-bold mt-4">
                  Custo Total do Projeto: {formatCurrency(totalCost)}
                </p>
              </div>
              <div className="mt-6 ml-4">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData} className="text-sm ml-4">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => formatCurrency(value)} />
                    <Tooltip
                      formatter={(value) => [formatCurrency(value), "Valor"]}
                    />
                    <Legend />
                    <Bar dataKey="valor" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="mt-4">
                O custo de mão de obra reflete as dificuldades de execução por
                ser no morro.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BudgetPresentation;
