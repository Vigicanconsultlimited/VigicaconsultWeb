import React, { useState } from "react";
import Button from "../../shared/Button";
import Modal from "../../shared/Modal";
import LoadingSpinner from "../../shared/LoadingSpinner";
import {
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  MessageSquare,
  CheckCircle,
  Clock,
} from "lucide-react";

export default function QuestionCenter() {
  const [questions, setQuestions] = useState([
    {
      id: 1,
      title: "How to upload academic documents?",
      category: "Documents",
      status: "published",
      author: "Admin",
      createdAt: "2024-01-15",
      views: 145,
      responses: 12,
    },
    {
      id: 2,
      title: "Application deadline information",
      category: "Applications",
      status: "draft",
      author: "Admin",
      createdAt: "2024-01-14",
      views: 89,
      responses: 5,
    },
    {
      id: 3,
      title: "Payment methods and procedures",
      category: "Payment",
      status: "published",
      author: "Admin",
      createdAt: "2024-01-13",
      views: 203,
      responses: 18,
    },
    {
      id: 4,
      title: "Technical support contact",
      category: "Support",
      status: "published",
      author: "Admin",
      createdAt: "2024-01-12",
      views: 67,
      responses: 3,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    title: "",
    category: "",
    content: "",
  });

  const categories = ["Documents", "Applications", "Payment", "Support"];

  const getStatusColor = (status) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      case "archived":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "published":
        return <CheckCircle size={16} />;
      case "draft":
        return <Clock size={16} />;
      default:
        return <Clock size={16} />;
    }
  };

  const filteredQuestions = questions.filter((question) => {
    const matchesSearch =
      question.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      question.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || question.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCreateQuestion = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const newId = Math.max(...questions.map((q) => q.id)) + 1;
      const createdQuestion = {
        ...newQuestion,
        id: newId,
        status: "draft",
        author: "Admin",
        createdAt: new Date().toISOString().split("T")[0],
        views: 0,
        responses: 0,
      };
      setQuestions([createdQuestion, ...questions]);
      setNewQuestion({ title: "", category: "", content: "" });
      setIsCreateModalOpen(false);
      setIsLoading(false);
    }, 1000);
  };

  const handleDeleteQuestion = (questionId) => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      setQuestions(questions.filter((q) => q.id !== questionId));
    }
  };

  return (
    <div className="question-center-section">
      <div className="section-header">
        <div className="header-content">
          <h1 className="section-title">Question Center</h1>
          <div className="header-actions">
            <Button
              variant="primary"
              leftIcon={<Plus size={16} />}
              onClick={() => setIsCreateModalOpen(true)}
            >
              Create Question
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="search-filter-container">
          <div className="search-input-container">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="category-filter">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="category-select"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <Button variant="outline" leftIcon={<Filter size={16} />}>
            More Filters
          </Button>
        </div>
      </div>

      {/* Questions Table */}
      <div className="questions-table-container">
        <div className="table-wrapper">
          <table className="questions-table">
            <thead>
              <tr>
                <th>Question</th>
                <th>Category</th>
                <th>Status</th>
                <th>Views</th>
                <th>Responses</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredQuestions.map((question) => (
                <tr key={question.id}>
                  <td className="question-title">
                    <div className="title-container">
                      <h4>{question.title}</h4>
                      <span className="author">by {question.author}</span>
                    </div>
                  </td>
                  <td>
                    <span className="category-badge">{question.category}</span>
                  </td>
                  <td>
                    <div className="status-container">
                      <span
                        className={`status-badge ${getStatusColor(
                          question.status
                        )}`}
                      >
                        {getStatusIcon(question.status)}
                        {question.status}
                      </span>
                    </div>
                  </td>
                  <td className="views-count">{question.views}</td>
                  <td className="responses-count">
                    <div className="responses-container">
                      <MessageSquare size={16} />
                      {question.responses}
                    </div>
                  </td>
                  <td className="created-date">{question.createdAt}</td>
                  <td className="actions">
                    <Button variant="ghost" size="sm" className="action-btn">
                      <Eye size={16} />
                    </Button>
                    <Button variant="ghost" size="sm" className="action-btn">
                      <Edit size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteQuestion(question.id)}
                      className="action-btn delete-btn"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Question Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Question"
        size="lg"
        footer={
          <div className="modal-footer-actions">
            <Button
              variant="outline"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleCreateQuestion}
              disabled={
                !newQuestion.title || !newQuestion.category || isLoading
              }
              leftIcon={
                isLoading ? <LoadingSpinner size="sm" /> : <Plus size={16} />
              }
            >
              {isLoading ? "Creating..." : "Create Question"}
            </Button>
          </div>
        }
      >
        <div className="create-question-form">
          <div className="form-group">
            <label htmlFor="questionTitle">Question Title</label>
            <input
              id="questionTitle"
              type="text"
              placeholder="Enter question title..."
              value={newQuestion.title}
              onChange={(e) =>
                setNewQuestion({ ...newQuestion, title: e.target.value })
              }
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="questionCategory">Category</label>
            <select
              id="questionCategory"
              value={newQuestion.category}
              onChange={(e) =>
                setNewQuestion({ ...newQuestion, category: e.target.value })
              }
              className="form-select"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="questionContent">Content</label>
            <textarea
              id="questionContent"
              placeholder="Enter question content..."
              value={newQuestion.content}
              onChange={(e) =>
                setNewQuestion({ ...newQuestion, content: e.target.value })
              }
              className="form-textarea"
              rows="6"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
