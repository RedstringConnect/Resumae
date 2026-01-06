import { useState, useEffect, useRef } from "react";
import { Send, Sparkles, Loader2, FileText, Upload, X } from "lucide-react";
import Lottie from "lottie-react";
import chatbotAnimation from "../../public/chatbot.json";
import { ResumeData } from "@/types";
import {
  processResumeChat,
  getChatSuggestions,
  ChatMessage,
  tailorResumeToJobDescription,
} from "@/services/resumeChatService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { extractTextFromPDF } from "@/services/groqService";
import toast from "react-hot-toast";

interface ResumeChatAssistantProps {
  resumeData: ResumeData;
  onResumeUpdate: (data: ResumeData) => void;
}

export default function ResumeChatAssistant({
  resumeData,
  onResumeUpdate,
}: ResumeChatAssistantProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      role: "assistant",
      content: "LOTTIE_ANIMATION",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showJobDescModal, setShowJobDescModal] = useState(false);
  const [jobDescText, setJobDescText] = useState("");
  const [isUploadingJD, setIsUploadingJD] = useState(false);
  const [hasJobDescription, setHasJobDescription] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getChatSuggestions(resumeData).then(setSuggestions);
  }, [resumeData]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isProcessing) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsProcessing(true);

    try {
      const result = await processResumeChat(inputValue, resumeData);

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: result.message,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      if (result.success && result.updatedData) {
        onResumeUpdate(result.updatedData);
        toast.success("Resume updated successfully!");

        // Change notifications hidden per user request
        // if (result.changes && result.changes.length > 0) {
        //   const changesMessage: ChatMessage = {
        //     id: (Date.now() + 2).toString(),
        //     role: "assistant",
        //     content: `📝 Changes made:\n${result.changes
        //       .map((c) => `• ${c}`)
        //       .join("\n")}`,
        //     timestamp: new Date(),
        //   };
        //   setMessages((prev) => [...prev, changesMessage]);
        // }
      }
    } catch (error) {
      console.error("Error in chat:", error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      toast.error("Failed to process message");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
  };

  const handleJobDescUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF file");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }

    setIsUploadingJD(true);
    toast.loading("Extracting job description...", { id: "jd-upload" });

    try {
      const extractedText = await extractTextFromPDF(file);
      if (extractedText) {
        setJobDescText(extractedText);
        toast.success("Job description extracted!", { id: "jd-upload" });
      } else {
        toast.error("Failed to extract text from PDF", { id: "jd-upload" });
      }
    } catch (error) {
      console.error("Error extracting job description:", error);
      toast.error("Failed to process PDF", { id: "jd-upload" });
    } finally {
      setIsUploadingJD(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleTailorResume = async () => {
    if (!jobDescText.trim()) {
      toast.error("Please enter or upload a job description");
      return;
    }

    setShowJobDescModal(false);
    setIsProcessing(true);

    const systemMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "assistant",
      content: "Analyzing job description and tailoring your resume...",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, systemMessage]);

    try {
      const result = await tailorResumeToJobDescription(
        jobDescText,
        resumeData
      );

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: result.message,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      if (result.success && result.updatedData) {
        onResumeUpdate(result.updatedData);
        setHasJobDescription(true);
        toast.success("Resume tailored to job description!");
      }
    } catch (error) {
      console.error("Error tailoring resume:", error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "Sorry, I encountered an error while tailoring your resume. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      toast.error("Failed to tailor resume");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClearJobDesc = () => {
    setJobDescText("");
    setHasJobDescription(false);
    toast.success("Job description cleared");
  };

  // const clearChat = () => {
  //   setMessages([
  //     {
  //       id: "1",
  //       role: "assistant",
  //       content: "LOTTIE_ANIMATION",
  //       timestamp: new Date(),
  //     },
  //   ]);
  // };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-900/80 rounded-3xl overflow-hidden">
      {/* Header */}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-white dark:bg-zinc-900/80 custom-scrollbar flex flex-col">
        <div className="space-y-3 flex-grow flex flex-col">
          {messages
            .filter((message) => {
              // Hide LOTTIE_ANIMATION after first user message
              if (message.content === "LOTTIE_ANIMATION") {
                return messages.length === 1;
              }
              return true;
            })
            .map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.content === "LOTTIE_ANIMATION"
                    ? "justify-center items-center flex-1"
                    : message.role === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                {message.content === "LOTTIE_ANIMATION" ? (
                  <div className="flex items-center justify-center">
                    <Lottie
                      animationData={chatbotAnimation}
                      loop={true}
                      style={{ width: 200, height: 200 }}
                    />
                  </div>
                ) : (
                  <div
                    className={`max-w-[85%] rounded-lg px-3 py-2 text-sm border ${
                      message.role === "user"
                        ? "bg-white dark:bg-black text-gray-900 dark:text-gray-100 border-gray-200 dark:border-[#2c2c2d]"
                        : "bg-gray-50/50 dark:bg-black/50 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-[#2c2c2d]"
                    }`}
                  >
                    {message.role === "assistant" && (
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <Sparkles className="h-3 w-3 text-gray-400 dark:text-gray-500" />
                        <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400">
                          AI
                        </span>
                      </div>
                    )}
                    <div className="whitespace-pre-wrap text-gray-800 dark:text-gray-200">
                      {message.content}
                    </div>
                    <div className="text-[10px] mt-1.5 text-gray-400 dark:text-gray-500">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))}
          {isProcessing && (
            <div className="flex justify-start">
              <div className="bg-gray-50/50 dark:bg-black/50 border border-gray-200 dark:border-[#2c2c2d] rounded-lg px-3 py-2">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-gray-500 dark:text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Thinking...
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions - Above Input (only show when no chat has started) */}
      {suggestions.length > 0 && messages.length === 1 && (
        <div className="px-4 py-2.5 border-t border-gray-200 dark:border-[#2c2c2d] bg-gray-50/30 dark:bg-zinc-900/30">
          <p className="text-[10px] text-gray-500 dark:text-gray-400 mb-2 font-medium uppercase tracking-wide">
            Suggestions:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {suggestions.slice(0, 3).map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="text-[11px] px-3 py-1.5 rounded-lg bg-white dark:bg-black border border-gray-200 dark:border-[#2c2c2d] text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-700 transition-all"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Job Description Section */}
      <div className="px-4 py-3 border-t border-gray-200 dark:border-[#2c2c2d] bg-gray-50/30 dark:bg-zinc-900/30">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">
            Job Description:
          </p>
          {hasJobDescription && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearJobDesc}
              className="h-5 w-5 p-0 text-gray-400 hover:text-red-500"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
        <Button
          onClick={() => setShowJobDescModal(true)}
          variant="outline"
          size="sm"
          className="w-full gap-2 text-xs border-gray-200 dark:border-[#2c2c2d] bg-white dark:bg-black text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900"
        >
          <FileText className="h-3.5 w-3.5" />
          {hasJobDescription ? "Update Job Description" : "Add Job Description"}
        </Button>
      </div>

      {/* Input */}
      <div className="p-3 border-t border-gray-200 dark:border-[#2c2c2d] bg-white dark:bg-black">
        <div className="flex gap-2">
          <Input
            placeholder="Type your message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            disabled={isProcessing}
            className="flex-1 h-9 text-sm bg-white/85 dark:bg-zinc-900/80 border-gray-200 dark:border-[#2c2c2d]"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isProcessing}
            size="sm"
            className="bg-black text-white hover:bg-[#0b0b0a] dark:bg-white dark:text-black dark:hover:bg-gray-100 px-3 h-9 rounded-lg"
          >
            {isProcessing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Job Description Modal */}
      <Dialog open={showJobDescModal} onOpenChange={setShowJobDescModal}>
        <DialogContent className="max-w-2xl bg-white dark:bg-black">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Add Job Description
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Upload a PDF or paste the job description below. I'll tailor
                your resume to match the requirements.
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                onChange={handleJobDescUpload}
                className="hidden"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingJD}
                variant="outline"
                className="w-full gap-2 border-dashed"
              >
                {isUploadingJD ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Extracting...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    Upload PDF
                  </>
                )}
              </Button>
            </div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200 dark:border-[#2c2c2d]" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-black px-2 text-gray-500">
                  Or paste text
                </span>
              </div>
            </div>
            <Textarea
              placeholder="Paste job description here..."
              value={jobDescText}
              onChange={(e) => setJobDescText(e.target.value)}
              className="min-h-[200px] text-sm"
              disabled={isUploadingJD}
            />
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowJobDescModal(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleTailorResume}
                disabled={!jobDescText.trim() || isProcessing}
                className="gap-2 bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Tailoring...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Tailor Resume
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
