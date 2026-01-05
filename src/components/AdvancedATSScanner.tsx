import { useState, useEffect } from "react";
import Lottie from "lottie-react";
import {
  Sparkles,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  Brain,
} from "lucide-react";
import scratchAnimation from "../../public/scratch.json";
import { ResumeData } from "@/types";
import {
  analyzeResumeWithGemini,
  GeminiATSAnalysis,
} from "@/services/groqService";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LabelList,
  RadialBarChart,
  RadialBar,
  Label,
} from "recharts";

interface AdvancedATSScannerProps {
  data: ResumeData;
}

export default function AdvancedATSScanner({ data }: AdvancedATSScannerProps) {
  const [analysis, setAnalysis] = useState<GeminiATSAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    handleAIAnalysis();
  }, [data]);

  const handleAIAnalysis = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await analyzeResumeWithGemini(data);
      if (result) {
        setAnalysis(result);
      } else {
        setError(
          "AI analysis failed. Please check your Groq API key and try again."
        );
      }
    } catch (err) {
      console.error("Error analyzing resume:", err);
      setError("Failed to analyze resume with AI. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-6">
        <div className="flex h-32 w-32 items-center justify-center">
          <Lottie animationData={scratchAnimation} loop={true} />
        </div>
        <div className="text-center space-y-2">
          <p className="text-lg font-semibold text-foreground">
            Analyzing your resume with AI
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-2 justify-center">
            <Brain className="h-4 w-4" />
            Powered by Groq Llama 3.1 8B
          </p>
        </div>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-6">
          <AlertCircle className="h-8 w-8 text-destructive" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Analysis Failed
        </h3>
        <p className="text-sm text-muted-foreground mb-6 text-center max-w-md">
          {error || "Unable to analyze resume. Please try again."}
        </p>
        <Button onClick={handleAIAnalysis} className="gap-2">
          <TrendingUp className="h-4 w-4" />
          Retry Analysis
        </Button>
      </div>
    );
  }

  const getScoreLabel = (score: number) => {
    if (score >= 90) return "Excellent";
    if (score >= 75) return "Good";
    if (score >= 60) return "Fair";
    return "Needs Work";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 ">
        <div className="space-y-1">
          <h3 className="text-2xl font-semibold text-foreground flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            <span>AI-Powered ATS Analysis</span>
          </h3>
          <p className="text-sm text-muted-foreground flex items-center gap-1.5">
            <Brain className="h-3.5 w-3.5" />
            Powered by Groq Llama 3.1 8B
          </p>
        </div>
        <Button
          onClick={handleAIAnalysis}
          variant="outline"
          size="sm"
          className="gap-2 mt-2"
        >
          <TrendingUp className="h-4 w-4" />
          Re-analyze
        </Button>
      </div>

      {/* Top Row: Overall Score (Left) + Radar Chart (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Overall Score - Radial Chart */}
        <Card className="p-6 border-none shadow-none">
          <h4 className="text-base font-semibold text-foreground mb-6 flex items-center gap-2">
            <svg
              className="w-6"
              viewBox="0 0 24 24"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              fill="#000000"
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                {" "}
                <title>ic_fluent_mail_all_accounts_24_filled</title>{" "}
                <desc>Created with Sketch.</desc>{" "}
                <g
                  id="🔍-Product-Icons"
                  stroke="none"
                  stroke-width="1"
                  fill="none"
                  fill-rule="evenodd"
                >
                  {" "}
                  <g
                    id="ic_fluent_mail_all_accounts_24_filled"
                    fill="#212121"
                    fill-rule="nonzero"
                  >
                    {" "}
                    <path
                      d="M17.75,3 C19.5449254,3 21,4.45507456 21,6.25 L21,17.75 C21,19.5449254 19.5449254,21 17.75,21 L6.25,21 C4.45507456,21 3,19.5449254 3,17.75 L3,6.25 C3,4.45507456 4.45507456,3 6.25,3 L17.75,3 Z M17.75,4.5 L6.25,4.5 C5.28350169,4.5 4.5,5.28350169 4.5,6.25 L4.5,13 L9,13 C9.37969577,13 9.69349096,13.2821539 9.74315338,13.6482294 L9.75,13.75 C9.75,14.9926407 10.7573593,16 12,16 C13.190864,16 14.1656449,15.0748384 14.2448092,13.9040488 L14.25,13.75 C14.25,13.3357864 14.5857864,13 15,13 L19.5,13 L19.5,6.25 C19.5,5.3318266 18.7928897,4.57880766 17.8935272,4.5058012 L17.75,4.5 Z M6.75,9.5 L17.25,9.5 C17.6642136,9.5 18,9.83578644 18,10.25 C18,10.6296958 17.7178461,10.943491 17.3517706,10.9931534 L17.25,11 L6.75,11 C6.33578644,11 6,10.6642136 6,10.25 C6,9.87030423 6.28215388,9.55650904 6.64822944,9.50684662 L6.75,9.5 L17.25,9.5 L6.75,9.5 Z M6.75,6.5 L17.25,6.5 C17.6642136,6.5 18,6.83578644 18,7.25 C18,7.62969577 17.7178461,7.94349096 17.3517706,7.99315338 L17.25,8 L6.75,8 C6.33578644,8 6,7.66421356 6,7.25 C6,6.87030423 6.28215388,6.55650904 6.64822944,6.50684662 L6.75,6.5 L17.25,6.5 L6.75,6.5 Z"
                      id="🎨-Color"
                    >
                      {" "}
                    </path>{" "}
                  </g>{" "}
                </g>{" "}
              </g>
            </svg>
            <span>Overall ATS Score</span>
          </h4>
          <ChartContainer
            config={
              {
                score: {
                  label: "Score",
                  color: "hsl(var(--foreground))",
                },
              } satisfies ChartConfig
            }
            className="mx-auto aspect-square max-h-[250px]"
          >
            <RadialBarChart
              data={[
                {
                  name: "Score",
                  score: analysis.overallScore,
                  fill: "hsl(var(--foreground))",
                },
              ]}
              startAngle={90}
              endAngle={90 - (360 * analysis.overallScore) / 100}
              innerRadius={80}
              outerRadius={110}
              barSize={15}
            >
              <PolarGrid
                gridType="circle"
                radialLines={false}
                stroke="hsl(var(--border))"
                strokeWidth={1}
              />
              <RadialBar
                dataKey="score"
                background={{ fill: "hsl(var(--muted))" }}
                cornerRadius={10}
              />
              <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-5xl font-bold"
                          >
                            {analysis.overallScore}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground text-sm"
                          >
                            out of 100
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 44}
                            className="fill-muted-foreground text-base font-medium"
                          >
                            {getScoreLabel(analysis.overallScore)}
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </PolarRadiusAxis>
            </RadialBarChart>
          </ChartContainer>
        </Card>

        {/* Radar Chart - Score Overview */}
        <Card className="p-6 border-none shadow-none">
          <h4 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
            <svg
              className="w-6"
              fill="currentColor"
              version="1.1"
              id="Capa_1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 399.997 399.997"
              xmlSpace="preserve"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                {" "}
                <g>
                  {" "}
                  <g>
                    {" "}
                    <g>
                      {" "}
                      <path d="M366.684,24.971H33.316C14.945,24.971,0,39.917,0,58.288V275.56c0,18.371,14.945,33.317,33.316,33.317h107.412 l-20.387,44.955c-2.105,4.643-1.709,10.037,1.053,14.321c2.762,4.285,7.51,6.873,12.607,6.873h131.996c0.006,0,0.014,0,0.02,0 c8.285,0,15-6.715,15-15c0-2.493-0.605-4.848-1.686-6.916l-20.062-44.233h107.412c18.371,0,33.316-14.946,33.316-33.317V58.288 C400,39.917,385.055,24.971,366.684,24.971z M370,275.561c0,1.829-1.488,3.316-3.316,3.316H235.998h-71.996H33.316 c-1.828,0-3.316-1.487-3.316-3.316V58.288c0-1.829,1.488-3.317,3.316-3.317h333.367c1.828,0,3.316,1.488,3.316,3.317L370,275.561 L370,275.561z"></path>{" "}
                      <path d="M320.624,69.329c-16.198,0-29.374,13.178-29.374,29.376c0,1.495,0.114,2.964,0.33,4.4l-68.61,40.032 c-5.35-5.575-12.864-9.057-21.184-9.057c-10.379,0-19.513,5.416-24.737,13.564l-68.428-26.781 c0.082-0.889,0.129-1.787,0.129-2.696c0-16.198-13.176-29.377-29.374-29.377S50,101.969,50,118.167 c0,16.198,13.178,29.375,29.376,29.375c8.132,0,15.501-3.324,20.827-8.681l72.457,28.359 c1.854,14.425,14.204,25.611,29.126,25.611c16.198,0,29.376-13.178,29.376-29.375c0-0.704-0.037-1.401-0.084-2.092l69.938-40.808 c5.203,4.674,12.076,7.525,19.606,7.525c16.198,0,29.376-13.178,29.376-29.376C349.999,82.507,336.822,69.329,320.624,69.329z M79.376,127.714c-5.265,0-9.547-4.283-9.547-9.547c0-5.265,4.282-9.548,9.547-9.548c5.262,0,9.546,4.283,9.546,9.548 C88.922,123.431,84.638,127.714,79.376,127.714z M201.786,173.002c-5.266,0-9.547-4.282-9.547-9.546 c0-5.265,4.281-9.547,9.547-9.547c5.266,0,9.547,4.283,9.547,9.547C211.333,168.72,207.052,173.002,201.786,173.002z M320.624,108.252c-5.263,0-9.548-4.283-9.548-9.547c0-5.264,4.285-9.548,9.548-9.548c5.264,0,9.547,4.284,9.547,9.548 C330.171,103.969,325.888,108.252,320.624,108.252z"></path>{" "}
                      <path d="M300.41,139.172l-58.462,34.111c-2.02,18.901-17.13,33.942-36.061,35.861v51.674h134.89V139.195 c-5.938,3.434-12.816,5.41-20.153,5.41C313.469,144.604,306.515,142.708,300.41,139.172z"></path>{" "}
                      <path d="M163.189,180.851l-60.974-23.864c-6.677,4.603-14.568,7.079-22.84,7.079c-7.338,0-14.217-1.976-20.153-5.408v102.16 h134.889V208.61C179.548,205.781,167.568,195.063,163.189,180.851z"></path>{" "}
                    </g>{" "}
                  </g>{" "}
                </g>{" "}
              </g>
            </svg>
            <span>Score Overview</span>
          </h4>
          <ChartContainer
            config={
              {
                score: {
                  label: "Score",
                  color: "hsl(var(--foreground))",
                },
              } satisfies ChartConfig
            }
            className="h-[280px] w-full"
          >
            <RadarChart
              data={Object.entries(analysis.detailedScores).map(
                ([key, value]) => ({
                  category: key.replace(/([A-Z])/g, " $1").trim(),
                  score: value,
                  fullMark: 100,
                })
              )}
            >
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis
                dataKey="category"
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 100]}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
              />
              <Radar
                name="Score"
                dataKey="score"
                stroke="hsl(var(--foreground))"
                fill="hsl(var(--foreground))"
                fillOpacity={0.2}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
            </RadarChart>
          </ChartContainer>
        </Card>
      </div>

      {/* Bottom: Detailed Breakdown - Horizontal Bar Chart */}
      <Card className="p-6 border-none shadow-none">
        <h4 className="text-base font-semibold text-foreground mb-6 flex items-center gap-2">
          <svg
            className="w-6"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              {" "}
              <path d="M15 1H1V3H15V1Z" fill="#000000"></path>{" "}
              <path
                d="M11 5H1V7H6.52779C7.62643 5.7725 9.223 5 11 5Z"
                fill="#000000"
              ></path>{" "}
              <path
                d="M5.34141 13C5.60482 13.7452 6.01127 14.4229 6.52779 15H1V13H5.34141Z"
                fill="#000000"
              ></path>{" "}
              <path
                d="M5.34141 9C5.12031 9.62556 5 10.2987 5 11H1V9H5.34141Z"
                fill="#000000"
              ></path>{" "}
              <path
                d="M15 11C15 11.7418 14.7981 12.4365 14.4462 13.032L15.9571 14.5429L14.5429 15.9571L13.032 14.4462C12.4365 14.7981 11.7418 15 11 15C8.79086 15 7 13.2091 7 11C7 8.79086 8.79086 7 11 7C13.2091 7 15 8.79086 15 11Z"
                fill="#000000"
              ></path>{" "}
            </g>
          </svg>
          <span>Detailed Breakdown</span>
        </h4>
        <ChartContainer
          config={
            {
              score: {
                label: "Score",
                color: "hsl(var(--foreground))",
              },
            } satisfies ChartConfig
          }
          className="h-[320px] w-full"
        >
          <BarChart
            data={Object.entries(analysis.detailedScores).map(
              ([key, value]) => ({
                category: key.replace(/([A-Z])/g, " $1").trim(),
                score: value,
              })
            )}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 5, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              horizontal={false}
              stroke="hsl(var(--border))"
            />
            <XAxis
              type="number"
              domain={[0, 100]}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
            />
            <YAxis
              type="category"
              dataKey="category"
              width={140}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            />
            <Bar
              dataKey="score"
              fill="hsl(var(--foreground))"
              radius={[0, 4, 4, 0]}
            >
              <LabelList
                dataKey="score"
                position="right"
                style={{ fill: "hsl(var(--muted-foreground))", fontSize: 13 }}
              />
            </Bar>
            <ChartTooltip content={<ChartTooltipContent />} />
          </BarChart>
        </ChartContainer>
      </Card>

      {/* Strengths */}
      {analysis.strengths.length > 0 && (
        <Card className="p-5 border-none shadow-none">
          <h4 className="text-base font-semibold text-foreground flex items-center gap-2 mb-4">
            <svg
              className="w-6"
              viewBox="0 0 512 512"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              role="img"
              preserveAspectRatio="xMidYMid meet"
              fill="currentColor"
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                <path
                  fill="#FFD3B6"
                  d="M472 362.5c-6.9-25.8-29.8-48.2-65-58.1c-26.4-7.4-74.2-17.3-118.6-5.5c-26.9 7.1-54.7 23.9-78.1 39.4V335c0-5.7.2-24.7.9-36.4c.4-12.5.8-25.3 1.6-38c.5-12.9 1.5-25.6 2.6-38.2c.8-12.8 2.9-24.6 4.4-36.5c1.9-10.9 5.4-21.5 9.2-31.3c12.8 8.1 30.9 14 53.8 14c30.6 0 45.1-9.4 51.2-16.3c3-3.4 8.2-9.8 3.8-21.9c-4.2-11.3-10.2-9.3-10.2-13.6c0-5.7 2.2-5.5 11-10c20-10.1 17.9-27.4 17.8-43.7c.1-1.2.1-2.3.1-3.5c0-32.8-31.9-59.4-71.1-59.4c-.8 0-1.6 0-2.4.1l-.2-.3c-32.8 0-53.6 9.7-66.1 24.2c-.6.4-1.1.8-1.7 1.3c-1.6 1.6-3.3 3.2-5.1 5c-6.7 6.8-16.8 17.7-20.8 24.6c-5.8 8-11.8 16.9-17.4 26.2c-6.4 9.4-11.8 19.5-18.5 30c-6.6 10.5-12.3 21.9-19.2 33.4c-12.5 23.3-26.7 48-38.9 73.7C83 244.1 71.2 270.3 62.2 296c-4.5 12.9-8.4 25.6-11.7 37.9c-3.1 12.6-6.5 24.1-7.9 35.9c-.2 1.5-.4 3-.5 4.5c-7.8 49.9-8.6 106.5-1.7 115.2c7.9 10.1 29.3 13.1 49.5 11.7c13.8-.9 77.9 10.5 140.5 10.5c3.6.1 7.2.2 10.9.2c47.9.2 100.9-3.3 132.2-17.2c91.6-40.5 113.2-77 98.5-132.2z"
                ></path>
                <path
                  fill="#EDC0A2"
                  d="M302.4 434.1c-2.1 0-4.2-.1-6.4-.2c-27.9-1.7-53.4-14.1-71.9-35c-3.4-3.8-3.1-9.7.8-13.1c3.8-3.4 9.7-3.1 13.1.8c15.2 17.2 36.2 27.4 59.1 28.7c22.9 1.4 45-6.3 62.1-21.5c3.8-3.4 9.7-3.1 13.1.8c3.4 3.8 3.1 9.7-.8 13.1c-19.2 17.1-43.5 26.4-69.1 26.4z"
                ></path>
              </g>
            </svg>
            <span>Strengths</span>
            <span className="ml-auto text-xs font-medium px-2 py-0.5 bg-muted text-muted-foreground rounded-full">
              {analysis.strengths.length}
            </span>
          </h4>
          <ul className="space-y-2">
            {analysis.strengths.map((strength, index) => (
              <li
                key={index}
                className="text-sm text-foreground flex items-start gap-3 py-2"
              >
                <span className="flex-shrink-0 text-muted-foreground mt-0.5">
                  •
                </span>
                <span className="flex-1">{strength}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Weaknesses */}
      {analysis.weaknesses.length > 0 && (
        <Card className="p-5 border-none shadow-none">
          <h4 className="text-base font-semibold text-foreground flex items-center gap-2 mb-4">
            <svg
              className="w-7"
              version="1.1"
              id="Layer_1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              xmlSpace="preserve"
              fill="currentColor"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                {" "}
                <path
                  style={{ fill: "#FFFFFF" }}
                  d="M334.395,508H55.893c-15.732-0.044-28.473-12.786-28.518-28.518V32.517 C27.42,16.785,40.162,4.044,55.893,3.999h323.37c15.732,0.044,28.473,12.786,28.518,28.518v402.306"
                ></path>{" "}
                <path
                  style={{ fill: "#8E8E8E" }}
                  d="M334.395,512H55.893c-17.95-0.026-32.495-14.574-32.517-32.525V32.517 C23.398,14.567,37.944,0.022,55.893,0h323.37c17.949,0.022,32.494,14.567,32.517,32.517v402.298h-7.999V32.517 c-0.017-13.533-10.984-24.5-24.517-24.517H55.893C42.36,8.017,31.393,18.984,31.375,32.517v446.958 c0.017,13.533,10.984,24.5,24.517,24.517h278.501L334.395,512L334.395,512z"
                ></path>{" "}
                <path d="M334.395,450.245v61.706l77.129-77.129h-61.706C341.311,434.849,334.421,441.739,334.395,450.245z"></path>{" "}
                <rect
                  x="433.989"
                  y="330.426"
                  transform="matrix(0.707 -0.7072 0.7072 0.707 -137.2327 426.3673)"
                  width="23.925"
                  height="96.759"
                ></rect>{" "}
                <path
                  style={{ fill: "#FFFFFF" }}
                  d="M296.527,388.7c-87.999,0-159.337-71.337-159.337-159.337c0-87.999,71.337-159.337,159.337-159.337 c87.999,0,159.337,71.337,159.337,159.337l0,0C455.767,317.322,384.486,388.603,296.527,388.7z"
                ></path>{" "}
                <path
                  style={{ fill: "#E21B1B" }}
                  d="M296.527,77.993c83.582-0.009,151.345,67.74,151.353,151.321 c0.009,83.582-67.74,151.345-151.321,151.353c-83.575,0.009-151.336-67.731-151.353-151.306 C145.279,145.813,212.977,78.094,296.527,77.993 M296.527,61.994c-92.417,0-167.336,74.919-167.336,167.336 s74.919,167.336,167.336,167.336c92.405,0,167.318-74.899,167.336-167.305c0.018-92.417-74.887-167.35-167.305-167.368 C296.548,61.994,296.537,61.994,296.527,61.994z"
                ></path>{" "}
                <path
                  style={{ fill: "#FFFFFF" }}
                  d="M296.527,365.597c-75.24-0.005-136.232-61.002-136.227-136.243 c0.005-75.24,61.002-136.232,136.243-136.227c75.237,0.005,136.227,60.998,136.227,136.235 C432.686,304.572,371.735,365.518,296.527,365.597z"
                ></path>{" "}
                <path
                  style={{ fill: "#CCCCCC" }}
                  d="M296.527,97.127c73.031,0,132.236,59.203,132.236,132.236s-59.203,132.236-132.236,132.236 s-132.236-59.203-132.236-132.236C164.375,156.365,223.53,97.21,296.527,97.127 M296.527,89.127 c-77.449,0-140.235,62.785-140.235,140.235s62.785,140.235,140.235,140.235s140.234-62.786,140.234-140.235l0,0 C436.761,151.913,373.976,89.127,296.527,89.127z"
                ></path>{" "}
                <g>
                  {" "}
                  <polygon
                    style={{ fill: "#999999" }}
                    points="212.951,274.311 203.887,261.127 271.713,214.5 294.735,245.201 369.335,192.974 378.503,206.084 291.214,267.183 268.121,236.385 "
                  ></polygon>{" "}
                  <polygon
                    style={{ fill: "#999999" }}
                    points="385.526,239.313 369.528,239.313 369.528,197.349 327.563,197.349 327.563,181.351 385.526,181.351 "
                  ></polygon>{" "}
                </g>{" "}
              </g>
            </svg>
            <span>Areas for Improvement</span>
            <span className="ml-auto text-xs font-medium px-2 py-0.5 bg-muted text-muted-foreground rounded-full">
              {analysis.weaknesses.length}
            </span>
          </h4>
          <ul className="space-y-2">
            {analysis.weaknesses.map((weakness, index) => (
              <li
                key={index}
                className="text-sm text-foreground flex items-start gap-3 py-2"
              >
                <span className="flex-shrink-0 text-muted-foreground mt-0.5">
                  •
                </span>
                <span className="flex-1">{weakness}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Suggestions */}
      {analysis.suggestions.length > 0 && (
        <Card className="p-5 border-none shadow-none">
          <h4 className="text-base font-semibold text-foreground flex items-center gap-2 mb-4">
            <svg
              className="w-6"
              viewBox="-4 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                {" "}
                <path
                  d="M13.0912 30.5454C13.0912 29.742 12.44 29.0908 11.6367 29.0908C10.8334 29.0908 10.1821 29.742 10.1821 30.5454C10.1821 31.3487 10.8334 31.9999 11.6367 31.9999C12.44 31.9999 13.0912 31.3487 13.0912 30.5454Z"
                  fill="#000000"
                ></path>{" "}
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M21.2847 18.1412C22.61 16.1755 23.2727 14.0072 23.2727 11.6364C23.2727 8.42307 22.1367 5.68035 19.8646 3.40822C17.5924 1.13607 14.8496 0 11.6364 0C8.42307 0 5.68035 1.13607 3.40822 3.40822C1.13607 5.68035 0 8.42307 0 11.6364C0 14.0072 0.662666 16.1755 1.988 18.1412C2.8852 19.472 3.98233 20.5561 5.27939 21.3935V21.3984C5.90081 21.8673 6.38841 22.4812 6.74214 23.2397C7.09587 23.9983 7.27273 24.8092 7.27273 25.6727C7.27273 25.7511 7.27117 25.8295 7.26807 25.9078C7.26498 25.9862 7.26032 26.0643 7.25412 26.1424H7.27273V26.1818H16V25.6727C16 24.7962 16.1818 23.9747 16.5456 23.2079C16.9094 22.4409 17.4095 21.8247 18.046 21.3593C19.3201 20.5267 20.3996 19.454 21.2847 18.1412Z"
                  fill="url(#paint0_radial_103_1531)"
                ></path>{" "}
                <path
                  d="M7.27246 27.6364C7.27246 29.2431 8.57491 30.5455 10.1816 30.5455H13.0906C14.6973 30.5455 15.9997 29.2431 15.9997 27.6364V26.1819H7.27246V27.6364Z"
                  fill="url(#paint1_radial_103_1531)"
                ></path>{" "}
                <path
                  d="M13.8184 27.6364H9.45481C9.05315 27.6364 8.72754 27.962 8.72754 28.3636C8.72754 28.7653 9.05315 29.0909 9.45481 29.0909H13.8184C14.2201 29.0909 14.5457 28.7653 14.5457 28.3636C14.5457 27.962 14.2201 27.6364 13.8184 27.6364Z"
                  fill="#000000"
                  fill-opacity="0.2"
                ></path>{" "}
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M8.55045 8.55082C9.40251 7.69877 10.431 7.27274 11.636 7.27274C12.0377 7.27274 12.3805 7.13073 12.6645 6.84672C12.9485 6.56269 13.0906 6.21985 13.0906 5.81819C13.0906 5.41653 12.9485 5.07369 12.6645 4.78967C12.3805 4.50566 12.0377 4.36365 11.636 4.36365C9.6277 4.36365 7.9135 5.07369 6.49342 6.49379C5.07333 7.91387 4.36328 9.62806 4.36328 11.6364C4.36328 12.038 4.50529 12.3809 4.78931 12.6649C5.07333 12.9489 5.41617 13.0909 5.81783 13.0909C6.21948 13.0909 6.56232 12.9489 6.84635 12.6649C7.13037 12.3809 7.27237 12.038 7.27237 11.6364C7.27237 10.4314 7.6984 9.40287 8.55045 8.55082Z"
                  fill="white"
                ></path>{" "}
                <defs>
                  {" "}
                  <radialGradient
                    id="paint0_radial_103_1531"
                    cx="0"
                    cy="0"
                    r="1"
                    gradientUnits="userSpaceOnUse"
                    gradientTransform="translate(7.74574 7.19893) rotate(56.4705) scale(19.63 17.4489)"
                  >
                    {" "}
                    <stop stop-color="#FADF73"></stop>{" "}
                    <stop offset="0.457142" stop-color="#FFD500"></stop>{" "}
                    <stop offset="1" stop-color="#FC9900"></stop>{" "}
                  </radialGradient>{" "}
                  <radialGradient
                    id="paint1_radial_103_1531"
                    cx="0"
                    cy="0"
                    r="1"
                    gradientUnits="userSpaceOnUse"
                    gradientTransform="translate(4.42694 24.8264) rotate(38.4256) scale(9.20221 18.4044)"
                  >
                    {" "}
                    <stop stop-color="#EFFCFF"></stop>{" "}
                    <stop offset="0.999999" stop-color="#A5F2FF"></stop>{" "}
                  </radialGradient>{" "}
                </defs>{" "}
              </g>
            </svg>
            <span>Actionable Suggestions</span>
            <span className="ml-auto text-xs font-medium px-2 py-0.5 bg-muted text-muted-foreground rounded-full">
              {analysis.suggestions.length}
            </span>
          </h4>
          <ul className="space-y-2">
            {analysis.suggestions.map((suggestion, index) => (
              <li
                key={index}
                className="text-sm text-foreground flex items-start gap-3 py-2 border-l-2 pl-3"
              >
                <span className="flex-1">{suggestion}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Industry Alignment */}
      {analysis.industryAlignment && (
        <Card className="p-5 border-none shadow-none">
          <h4 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
            <svg
              className="w-8"
              fill="currentColor"
              version="1.1"
              id="Capa_1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 32.046 32.045"
              xmlSpace="preserve"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                {" "}
                <g>
                  {" "}
                  <g>
                    {" "}
                    <path d="M18.812,12.025l-0.55,1.798c0.491,0.157,0.85,0.639,0.85,1.21c0,0.286-0.091,0.549-0.242,0.761l1.433,1.17 c0.396-0.533,0.63-1.203,0.63-1.932C20.932,13.606,20.033,12.41,18.812,12.025z"></path>{" "}
                    <path d="M17.622,16.374c-0.652-0.006-1.179-0.572-1.179-1.262c0-0.689,0.526-1.255,1.179-1.26c0.123-0.001,0.24,0.018,0.353,0.054 l0.547-1.795c-0.285-0.09-0.587-0.136-0.898-0.129c-1.61,0.033-2.895,1.436-2.895,3.129c0,1.694,1.284,3.099,2.895,3.132 c0.963,0.021,1.828-0.451,2.383-1.202l-1.427-1.169C18.358,16.179,18.013,16.377,17.622,16.374z"></path>{" "}
                    <path d="M30.155,12.956c1.891-0.733,1.891-0.804,1.891-0.994v-1.482c0-0.19,0-0.27-1.892-0.944l-0.066-0.024l-0.267-0.633 l0.028-0.064c0.805-1.823,0.749-1.877,0.615-2.009l-1.07-1.047c-0.044-0.043-0.121-0.074-0.188-0.074 c-0.062,0-0.242,0-1.826,0.717L27.317,6.43l-0.651-0.263L26.64,6.102c-0.745-1.844-0.823-1.844-1.007-1.844h-1.514 c-0.187,0-0.27,0-0.959,1.847l-0.026,0.067l-0.649,0.265l-0.062-0.026c-1.071-0.452-1.696-0.681-1.859-0.681 c-0.065,0-0.144,0.03-0.188,0.073l-1.073,1.049c-0.136,0.134-0.192,0.19,0.653,1.975l0.03,0.066L19.72,9.525L19.654,9.55 c-0.215,0.083-0.401,0.157-0.57,0.224c-0.063,0.025-0.438,0.269-0.673,0.417l-4.931-0.27l-1.696,8.13h-0.001l-0.033,0.005 c-0.41-0.696-1.174-1.092-2.239-1.092H9.045c-0.625,0.61-1.718,1.019-2.97,1.019s-2.345-0.408-2.97-1.019H2.639 c-1.643,0-2.584,0.928-2.584,2.476c0,1.549-0.05,5.781-0.05,6.625s-0.101,1.723,0.627,1.723c0.269,0,1.125,0,2.235,0 c1.059,0,2.076,0,3.009,0c0.129,0,0.272,0,0.397,0c1.196,0,2.19,0,2.762,0c0.102,0,0.173,0,0.247,0c0.032,0,0.08,0,0.106,0 c0.93,0,1.644,0,1.882,0c0.099,0,0.192,0,0.247,0c0.729,0,0.627-0.879,0.627-1.723c0-0.13-0.002-0.349-0.003-0.617h19.881v-1.345 H12.13c-0.004-0.379-0.008-0.784-0.012-1.196l1.895,0.725l9.375-1.491l0.939-3.896h1.367c0.19,0,0.27,0,0.959-1.848l0.026-0.066 l0.65-0.263l0.062,0.025c1.07,0.453,1.695,0.682,1.857,0.682c0.064,0,0.145-0.029,0.188-0.072l1.073-1.051 c0.136-0.135,0.191-0.19-0.655-1.973l-0.03-0.067l0.265-0.63L30.155,12.956z M13.951,10.681l9.806,0.655l-2.146,9.061l-9.188-2.6 L13.951,10.681z M12.095,19.44c0-0.277-0.04-0.527-0.1-0.764l0.035-0.006l7.777,2.221l-3.552,0.503l-4.159-1.354 C12.096,19.815,12.095,19.61,12.095,19.44z M12.1,20.589l1.073,0.358l-1.069,0.16C12.102,20.929,12.101,20.755,12.1,20.589z M25.451,13.591l0.565-2.347l-0.568-0.396L22.91,21.676l-8.834,1.292v-0.004l-1.963-0.718c-0.002-0.188-0.004-0.371-0.005-0.555 l1.999,0.717l8.259-1.108l2.547-10.756l-2.273-0.123c0.027-0.101,0.056-0.201,0.063-0.216c0.396-0.802,1.234-1.357,2.204-1.357 c1.353,0,2.451,1.078,2.451,2.404C27.358,12.393,26.542,13.348,25.451,13.591z"></path>{" "}
                    <path d="M1.618,11.909c-0.009,0.058-0.021,0.116-0.028,0.175c-0.273,2.544,1.526,4.833,4.012,5.102 c2.487,0.27,4.734-1.583,5.01-4.127c0.041-0.393,0.029-0.778-0.023-1.152c0.292-0.002,0.473-0.006,0.513-0.012 c0.317-0.04,0.57-0.063,0.596-0.413c0.005-0.467-0.008-0.392-0.001-0.461c0.008-0.404-0.229-0.357-0.491-0.385 c-0.262-0.028-0.583,0.012-0.583,0.012S9.868,5.572,5.172,6.401C3.768,6.649,2.843,7.242,2.235,7.95 c1.199-0.596,2.613-0.882,3.843-0.713c1.173,0.162,2.093,0.706,2.686,1.571C8.369,8.515,7.926,8.285,7.442,8.135 C6.959,7.85,6.446,7.712,6.019,7.653C4.601,7.451,2.93,7.899,1.693,8.749C0.9,10.26,1.13,11.907,1.13,11.907 S1.313,11.907,1.618,11.909z M2.425,12.174c0.009-0.089,0.025-0.176,0.042-0.263c1.897,0.003,5.361,0.009,7.275,0.001 c0.059,0.341,0.074,0.695,0.034,1.056c-0.226,2.084-2.059,3.603-4.084,3.383C3.664,16.132,2.2,14.258,2.425,12.174z"></path>{" "}
                  </g>{" "}
                </g>{" "}
              </g>
            </svg>
            <span>Industry Alignment</span>
          </h4>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-muted">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Detected Industry
              </span>
              <div className="mt-2 flex items-center gap-3">
                <span className="text-base font-semibold text-foreground">
                  {analysis.industryAlignment.detectedIndustry}
                </span>
                <span className="text-xs text-muted-foreground">
                  {analysis.industryAlignment.confidence}% confidence
                </span>
              </div>
            </div>
            {analysis.industryAlignment.relevantKeywords.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="text-sm font-medium text-foreground">
                    Relevant Keywords Found
                  </span>
                  <span className="text-xs font-medium px-2 py-0.5 bg-muted text-muted-foreground rounded-full">
                    {analysis.industryAlignment.relevantKeywords.length}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {analysis.industryAlignment.relevantKeywords.map(
                    (keyword, index) => (
                      <span
                        key={index}
                        className="px-2.5 py-1 bg-muted text-foreground text-xs font-medium rounded-md"
                      >
                        {keyword}
                      </span>
                    )
                  )}
                </div>
              </div>
            )}
            {analysis.industryAlignment.missingKeywords.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm font-medium text-foreground">
                    Missing Important Keywords
                  </span>
                  <span className="text-xs font-medium px-2 py-0.5 bg-muted text-muted-foreground rounded-full">
                    {analysis.industryAlignment.missingKeywords.length}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {analysis.industryAlignment.missingKeywords.map(
                    (keyword, index) => (
                      <span
                        key={index}
                        className="px-2.5 py-1 border text-foreground text-xs font-medium rounded-md"
                      >
                        {keyword}
                      </span>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* ATS Compatibility */}
      {analysis.atsCompatibility && (
        <Card className="p-6 border-none shadow-none">
          <h4 className="text-base font-semibold text-foreground mb-6 flex items-center gap-2">
            <svg
              className="w-8"
              viewBox="0 0 1000 1000"
              id="Layer_2"
              version="1.1"
              xmlSpace="preserve"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              fill="currentColor"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                {" "}
                <g>
                  {" "}
                  <path
                    d="M818.039,180.784H182.215c-16.5,0-30,13.5-30,30v361.46h695.824v-361.46 C848.039,194.284,834.539,180.784,818.039,180.784z M355.484,218.681h19.143c6.875,0,12.5,5.625,12.5,12.5s-5.625,12.5-12.5,12.5 h-19.143c-6.875,0-12.5-5.625-12.5-12.5S348.609,218.681,355.484,218.681z M427.752,312.294c6.875,0,12.5,5.625,12.5,12.5 s-5.625,12.5-12.5,12.5H314.609c-6.875,0-12.5-5.625-12.5-12.5s5.625-12.5,12.5-12.5H427.752z M371.18,378.869 c0,6.875-5.625,12.5-12.5,12.5h-44.072c-6.875,0-12.5-5.625-12.5-12.5s5.625-12.5,12.5-12.5h44.072 C365.555,366.369,371.18,371.994,371.18,378.869z M280.484,218.681h19.143c6.875,0,12.5,5.625,12.5,12.5s-5.625,12.5-12.5,12.5 h-19.143c-6.875,0-12.5-5.625-12.5-12.5S273.609,218.681,280.484,218.681z M269.109,324.794c0,6.875-5.625,12.5-12.5,12.5h-50 c-6.875,0-12.5-5.625-12.5-12.5s5.625-12.5,12.5-12.5h50C263.484,312.294,269.109,317.919,269.109,324.794z M269.109,378.869 c0,6.875-5.625,12.5-12.5,12.5h-16.857c-6.875,0-12.5-5.625-12.5-12.5s5.625-12.5,12.5-12.5h16.857 C263.484,366.369,269.109,371.994,269.109,378.869z M205.484,218.681h19.143c6.875,0,12.5,5.625,12.5,12.5s-5.625,12.5-12.5,12.5 h-19.143c-6.875,0-12.5-5.625-12.5-12.5S198.609,218.681,205.484,218.681z M194.109,432.945c0-6.875,5.625-12.5,12.5-12.5h117.536 c6.875,0,12.5,5.625,12.5,12.5s-5.625,12.5-12.5,12.5H206.609C199.734,445.445,194.109,439.82,194.109,432.945z M256.609,499.52 h-16.857c-6.875,0-12.5-5.625-12.5-12.5s5.625-12.5,12.5-12.5h16.857c6.875,0,12.5,5.625,12.5,12.5S263.484,499.52,256.609,499.52z M358.68,499.52h-44.072c-6.875,0-12.5-5.625-12.5-12.5s5.625-12.5,12.5-12.5h44.072c6.875,0,12.5,5.625,12.5,12.5 S365.555,499.52,358.68,499.52z M501.752,499.52H420.68c-6.875,0-12.5-5.625-12.5-12.5s5.625-12.5,12.5-12.5h81.071 c6.875,0,12.5,5.625,12.5,12.5S508.627,499.52,501.752,499.52z M501.752,445.445H383.68c-6.875,0-12.5-5.625-12.5-12.5 s5.625-12.5,12.5-12.5h118.071c6.875,0,12.5,5.625,12.5,12.5S508.627,445.445,501.752,445.445z M501.752,391.369h-83.536 c-6.875,0-12.5-5.625-12.5-12.5s5.625-12.5,12.5-12.5h83.536c6.875,0,12.5,5.625,12.5,12.5S508.627,391.369,501.752,391.369z M625.009,442.596c4.861,4.861,4.861,12.816,0,17.678c-4.861,4.861-12.816,4.861-17.678,0L560.958,413.9 c-4.861-4.861-4.861-12.816,0-17.678l46.374-46.374c4.861-4.861,12.816-4.861,17.678,0c4.861,4.861,4.861,12.816,0,17.678 l-37.535,37.535L625.009,442.596z M715.198,332.878L672.31,484.067c-1.876,6.614-8.823,10.49-15.437,8.614h0 c-6.614-1.876-10.49-8.823-8.614-15.437l42.888-151.189c1.876-6.614,8.823-10.49,15.437-8.614 C713.198,319.317,717.074,326.264,715.198,332.878z M802.499,413.9l-46.373,46.374c-4.861,4.861-12.816,4.861-17.678,0 c-4.861-4.861-4.861-12.816,0-17.678l37.535-37.535l-37.535-37.535c-4.861-4.861-4.861-12.816,0-17.678 c4.862-4.861,12.816-4.861,17.678,0l46.373,46.374C807.36,401.083,807.36,409.038,802.499,413.9z"
                    style={{ fill: "#231F20" }}
                  ></path>{" "}
                  <path
                    d="M610.607,762.063H389.646c-10.197,0-18.539,8.343-18.539,18.539v38.614h258.039v-38.614 C629.146,770.406,620.804,762.063,610.607,762.063z"
                    style={{ fill: "#231F20" }}
                  ></path>{" "}
                  <ellipse
                    cx="500.375"
                    cy="666.877"
                    rx="17.453"
                    ry="17.454"
                    style={{ fill: "#231F20" }}
                    transform="matrix(0.9975 -0.0709 0.0709 0.9975 -46.0156 37.149)"
                  ></ellipse>{" "}
                  <path
                    d="M151.961,598.519l0.229,62.484c0.061,16.5,13.61,29.95,30.11,29.89l102.911-0.377l0.106,28.795 c0.037,10.196,8.411,18.508,18.607,18.471l392.919-1.439c10.196-0.037,18.509-8.41,18.471-18.607l-0.105-28.795l102.911-0.377 c16.5-0.06,29.95-13.61,29.89-30.11l-0.229-62.484L151.961,598.519z M543.106,670.086c0,3.705-3.004,6.708-6.708,6.708 c-0.356,0-0.702-0.036-1.043-0.089c-0.865,3.086-2.129,6.004-3.73,8.699c0.235,0.18,0.464,0.37,0.679,0.585l0,0 c2.62,2.62,2.62,6.867,0,9.487l-4.115,4.115c-2.62,2.62-6.867,2.62-9.487,0h0c-0.286-0.286-0.534-0.594-0.758-0.914 c-2.526,1.398-5.235,2.504-8.084,3.272c0.088,0.433,0.134,0.88,0.134,1.339c0,3.705-3.004,6.708-6.708,6.708h-5.82 c-3.705,0-6.708-3.004-6.708-6.708c0-0.459,0.047-0.906,0.134-1.339c-3.046-0.821-5.933-2.027-8.606-3.565 c-0.274,0.451-0.598,0.88-0.988,1.27c-2.62,2.62-6.867,2.62-9.487,0l-4.115-4.115c-2.62-2.62-2.62-6.867,0-9.487 c0.381-0.381,0.8-0.7,1.24-0.971c-1.538-2.65-2.75-5.513-3.582-8.534c-0.567,0.156-1.162,0.246-1.779,0.246 c-3.705,0-6.708-3.003-6.708-6.708v-5.82c0-3.705,3.004-6.708,6.708-6.708c0.562,0,1.105,0.077,1.627,0.207 c0.783-3.032,1.95-5.91,3.443-8.581c-0.513-0.291-0.999-0.649-1.436-1.087c-2.62-2.62-2.62-6.867,0-9.487l4.115-4.115 c2.62-2.62,6.867-2.62,9.487,0c0.366,0.367,0.676,0.767,0.94,1.189c2.822-1.688,5.891-3.004,9.141-3.881 c-0.088-0.433-0.134-0.88-0.134-1.339c0-3.705,3.004-6.708,6.708-6.708h5.82c3.705,0,6.708,3.004,6.708,6.708 c0,0.458-0.047,0.906-0.134,1.339c3.057,0.825,5.955,2.036,8.636,3.582c0.208-0.288,0.434-0.567,0.694-0.827 c2.62-2.62,6.867-2.62,9.487,0l4.115,4.115c2.62,2.62,2.62,6.867,0,9.487c-0.268,0.268-0.557,0.502-0.856,0.716 c1.552,2.715,2.763,5.65,3.576,8.747c0.291-0.039,0.586-0.065,0.887-0.065c3.705,0,6.708,3.003,6.708,6.708V670.086z"
                    style={{ fill: "#231F20" }}
                  ></path>{" "}
                </g>{" "}
              </g>
            </svg>
            <span>ATS System Compatibility</span>
          </h4>
          <ChartContainer
            config={
              {
                score: {
                  label: "Compatibility",
                  color: "hsl(var(--foreground))",
                },
              } satisfies ChartConfig
            }
            className="h-[280px] w-full"
          >
            <BarChart
              data={Object.entries(analysis.atsCompatibility).map(
                ([system, score]) => ({
                  system: system.charAt(0).toUpperCase() + system.slice(1),
                  score: score,
                })
              )}
              layout="vertical"
              margin={{ top: 5, right: 40, left: 10, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                horizontal={false}
                stroke="hsl(var(--border))"
              />
              <XAxis
                type="number"
                domain={[0, 100]}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
              />
              <YAxis
                type="category"
                dataKey="system"
                width={90}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
              />
              <Bar
                dataKey="score"
                fill="hsl(var(--foreground))"
                radius={[0, 4, 4, 0]}
              >
                <LabelList
                  dataKey="score"
                  position="right"
                  formatter={(value: number) => `${value}%`}
                  style={{
                    fill: "hsl(var(--muted-foreground))",
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                />
              </Bar>
              <ChartTooltip content={<ChartTooltipContent />} />
            </BarChart>
          </ChartContainer>
        </Card>
      )}

      {/* Actionable Insights */}
      {analysis.actionableInsights.length > 0 && (
        <Card className="p-5 border-none shadow-none">
          <h4 className="text-base font-semibold text-foreground flex items-center gap-2 mb-4">
            <svg
              viewBox="0 0 1024 1024"
              className="w-6 icon"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              fill="#000000"
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                <path
                  d="M232.209424 581.026178l60.314136 68.356021 32.167539 62.994764 7.371728 54.95288 9.382199 91.141361-40.209424-26.136125-42.219895-38.198953-36.188482-40.209424-24.125654-52.942409-11.39267-58.973822 16.083769-44.230366 28.816754-16.753927z"
                  fill="#FFCE54"
                ></path>
                <path
                  d="M336.08377 878.575916a16.753927 16.753927 0 0 1-10.052356-3.350785c-15.413613-11.39267-150.78534-116.60733-154.806283-220.481676a107.225131 107.225131 0 0 1 38.86911-87.790575 16.753927 16.753927 0 0 1 22.115183 25.465968 74.387435 74.387435 0 0 0-28.146597 61.65445c0 71.706806 93.82199 158.827225 141.403142 195.015707a16.753927 16.753927 0 0 1-10.052356 30.157068z"
                  fill="#FFCE54"
                ></path>
                <path
                  d="M292.52356 650.722513a372.60733 372.60733 0 0 1-125.319372-276.104712c0-62.324607 58.973822-152.795812 232.544503-186.973822s330.387435 34.848168 373.947644 85.780105Q879.581152 361.884817 760.963351 1005.235602a20.774869 20.774869 0 0 1-20.774869 17.424084H358.86911a20.774869 20.774869 0 0 1-20.774869-17.424084 1474.34555 1474.34555 0 0 0 0-187.643979 393.382199 393.382199 0 0 0-45.570681-166.86911z"
                  fill="#DA4453"
                ></path>
                <path
                  d="M537.13089 833.675393h258.010471l-21.445026 122.638743H537.13089a60.984293 60.984293 0 0 1-60.984293-60.984293 60.984293 60.984293 0 0 1 60.984293-61.65445z"
                  fill="#FFCE54"
                ></path>
                <path
                  d="M94.827225 201.04712H50.596859v-33.507853h18.09424a237.235602 237.235602 0 0 0 125.319372-15.413613c12.732984-8.041885 32.167539-34.17801 52.942409-109.905759L251.643979 23.455497l32.167539 8.712042-5.361256 16.08377a224.502618 224.502618 0 0 1-67.015707 129.340314A228.52356 228.52356 0 0 1 94.827225 201.04712z"
                  fill="#DA4453"
                ></path>
                <path
                  d="M390.366492 109.905759a319.664921 319.664921 0 0 1-134.031413-49.591623L240.921466 51.602094l16.08377-28.816754 14.743455 8.041885a259.350785 259.350785 0 0 0 121.968586 45.570681 233.884817 233.884817 0 0 0 107.225131-67.015707L513.675393 0l21.445026 25.465969L519.706806 36.188482a268.062827 268.062827 0 0 1-123.3089 73.04712z"
                  fill="#DA4453"
                ></path>
                <path
                  d="M638.324607 129.340314h-12.062827A277.445026 277.445026 0 0 1 500.272251 37.528796L488.879581 25.465969 513.005236 0l11.39267 12.062827c60.984293 62.994764 91.811518 78.408377 107.225131 81.089005s47.581152-3.350785 117.947644-44.900523l14.073298-8.712042 16.753927 28.816754-14.743456 8.712042a285.486911 285.486911 0 0 1-127.329843 52.272251z"
                  fill="#DA4453"
                ></path>
                <path
                  d="M901.696335 214.450262a155.47644 155.47644 0 0 1-74.387434-13.403142 220.481675 220.481675 0 0 1-76.397906-113.926701l-6.031414-15.413613 30.827225-12.732984 6.031414 15.413613c26.806283 67.015707 48.251309 89.13089 61.65445 96.502617a190.994764 190.994764 0 0 0 109.235602 6.701571h16.753927l4.020942 33.507853h-16.753926a461.068063 461.068063 0 0 1-54.95288 3.350786z"
                  fill="#DA4453"
                ></path>
              </g>
            </svg>
            <span>High-Priority Action Items</span>
            <span className="ml-auto text-xs font-medium px-2 py-0.5 bg-muted text-muted-foreground rounded-full">
              {analysis.actionableInsights.length}
            </span>
          </h4>
          <ul className="space-y-2">
            {analysis.actionableInsights.map((insight, index) => (
              <li
                key={index}
                className="text-sm text-foreground flex items-start gap-3 py-2"
              >
                <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-foreground text-background text-xs font-semibold">
                  {index + 1}
                </span>
                <span className="flex-1 font-medium">{insight}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
