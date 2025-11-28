// AIQ Scoring Algorithm - CORE INTELLECTUAL PROPERTY
class AIQScorer {
    constructor() {
        this.scores = {
            clarity: 0,
            depth: 0,
            efficiency: 0,
            creativity: 0
        };
        this.maxScores = {
            clarity: 25,
            depth: 25,
            efficiency: 25,
            creativity: 25
        };
    }

    // NOVEL SCORING ALGORITHM - PROTECT THIS
    evaluateResponse(response, questionType) {
        let scoreBreakdown = {
            clarity: this.scoreClarity(response),
            depth: this.scoreDepth(response, questionType),
            efficiency: this.scoreEfficiency(response),
            creativity: this.scoreCreativity(response)
        };

        return scoreBreakdown;
    }

    scoreClarity(response) {
        let score = 5; // Base score
        
        // Sentence structure analysis
        if (response.includes('.') && response.length > 50) score += 5;
        if (response.includes('?') && response.match(/\?/g) && response.match(/\?/g).length <= 3) score += 3;
        
        // Specificity indicators
        const specificMarkers = ['specific', 'detailed', 'clear', 'precise', 'exact'];
        if (specificMarkers.some(marker => response.toLowerCase().includes(marker))) score += 4;
        
        // Goal definition
        if (response.includes('goal') || response.includes('objective') || response.includes('purpose')) score += 3;
        
        // Structure indicators
        if (response.includes('\n') || response.includes('- ') || response.includes('1.')) score += 5;
        
        return Math.min(score, this.maxScores.clarity);
    }

    scoreDepth(response, questionType) {
        let score = 5;
        
        // Advanced capability usage
        const advancedMarkers = ['analyze', 'synthesize', 'compare', 'evaluate', 'strategize'];
        const foundAdvanced = advancedMarkers.filter(marker => 
            response.toLowerCase().includes(marker)
        ).length;
        score += Math.min(foundAdvanced * 3, 9);
        
        // Multi-step reasoning
        const stepIndicators = ['first', 'then', 'next', 'finally', 'step'];
        const steps = stepIndicators.filter(indicator => 
            response.toLowerCase().includes(indicator)
        ).length;
        score += Math.min(steps * 2, 6);
        
        // Context awareness
        if (response.length > 200) score += 3;
        if (response.includes('context') || response.includes('background')) score += 2;
        
        return Math.min(score, this.maxScores.depth);
    }

    scoreEfficiency(response) {
        let score = 5;
        
        // Conciseness vs completeness balance
        const wordCount = response.split(' ').length;
        if (wordCount >= 50 && wordCount <= 200) score += 8;
        else if (wordCount > 200 && wordCount <= 400) score += 5;
        else if (wordCount > 400) score += 2;
        
        // Directness indicators
        const directMarkers = ['directly', 'specifically', 'exactly', 'precisely'];
        if (directMarkers.some(marker => response.toLowerCase().includes(marker))) score += 4;
        
        // Error correction consideration
        if (response.includes('if not') || response.includes('alternative') || 
            response.includes('otherwise')) score += 3;
        
        return Math.min(score, this.maxScores.efficiency);
    }

    scoreCreativity(response) {
        let score = 5;
        
        // Novel approach indicators
        const creativeMarkers = ['innovative', 'creative', 'novel', 'unique', 'original'];
        if (creativeMarkers.some(marker => response.toLowerCase().includes(marker))) score += 5;
        
        // Unconventional applications
        const unconventional = ['unconventional', 'different approach', 'new way', 'alternative method'];
        if (unconventional.some(marker => response.toLowerCase().includes(marker))) score += 5;
        
        // Multi-disciplinary thinking
        const domains = ['business', 'technical', 'creative', 'analytical', 'strategic'];
        const domainCount = domains.filter(domain => 
            response.toLowerCase().includes(domain)
        ).length;
        score += Math.min(domainCount * 2, 6);
        
        // Metaphor and analogy usage
        if (response.includes('like') || response.includes('similar to') || 
            response.includes('analogous')) score += 4;
        
        return Math.min(score, this.maxScores.creativity);
    }

    calculateTotalAIQ(scoreBreakdown) {
        const total = Object.values(scoreBreakdown).reduce((sum, score) => sum + score, 0);
        return Math.min(Math.round((total / 100) * 100), 100); // Convert to percentage
    }

    getAIQLevel(score) {
        if (score >= 90) return 'AI Expert';
        if (score >= 75) return 'AI Proficient';
        if (score >= 60) return 'AI Competent';
        if (score >= 40) return 'AI Beginner';
        return 'AI Novice';
    }
}

// Test Management
class TestManager {
    constructor() {
        this.currentQuestion = 1;
        this.totalQuestions = 5;
        this.responses = {};
        this.scorer = new AIQScorer();
    }

    nextQuestion() {
        if (this.currentQuestion < this.totalQuestions) {
            this.saveCurrentResponse();
            this.currentQuestion++;
            this.updateDisplay();
        } else {
            this.submitTest();
        }
    }

    previousQuestion() {
        if (this.currentQuestion > 1) {
            this.saveCurrentResponse();
            this.currentQuestion--;
            this.updateDisplay();
        }
    }

    saveCurrentResponse() {
        const response = document.getElementById(`response${this.currentQuestion}`).value;
        this.responses[this.currentQuestion] = response;
    }

    updateDisplay() {
        // Hide all questions
        document.querySelectorAll('.question').forEach(q => q.classList.remove('active'));
        
        // Show current question
        document.getElementById(`question${this.currentQuestion}`).classList.add('active');
        
        // Update progress
        const progress = (this.currentQuestion / this.totalQuestions) * 100;
        document.getElementById('progress').style.width = `${progress}%`;
        document.getElementById('currentQ').textContent = this.currentQuestion;
        
        // Update buttons
        document.getElementById('prevBtn').style.display = this.currentQuestion === 1 ? 'none' : 'block';
        document.getElementById('nextBtn').style.display = this.currentQuestion === this.totalQuestions ? 'none' : 'block';
        document.getElementById('submitBtn').style.display = this.currentQuestion === this.totalQuestions ? 'block' : 'none';
        
        // Load saved response
        if (this.responses[this.currentQuestion]) {
            document.getElementById(`response${this.currentQuestion}`).value = this.responses[this.currentQuestion];
        }
    }

    submitTest() {
        this.saveCurrentResponse();
        
        // Calculate scores
        let totalScoreBreakdown = { clarity: 0, depth: 0, efficiency: 0, creativity: 0 };
        let questionCount = 0;

        for (const [qNum, response] of Object.entries(this.responses)) {
            if (response && response.trim()) {
                const breakdown = this.scorer.evaluateResponse(response, parseInt(qNum));
                for (const category in breakdown) {
                    totalScoreBreakdown[category] += breakdown[category];
                }
                questionCount++;
            }
        }

        // Average the scores
        if (questionCount > 0) {
            for (const category in totalScoreBreakdown) {
                totalScoreBreakdown[category] = Math.round(totalScoreBreakdown[category] / questionCount);
            }
        }

        const aiqScore = this.scorer.calculateTotalAIQ(totalScoreBreakdown);
        const aiqLevel = this.scorer.getAIQLevel(aiqScore);
        
        // Generate certificate code
        const certCode = 'AIQ-' + Math.random().toString(36).substring(2, 10).toUpperCase();
        
        // Store results
        const results = {
            score: aiqScore,
            level: aiqLevel,
            breakdown: totalScoreBreakdown,
            certificateCode: certCode,
            timestamp: new Date().toISOString()
        };
        
        localStorage.setItem('aiqResults', JSON.stringify(results));
        
        // Redirect to results page
        window.location.href = 'results.html';
    }
}

// Verification System
class VerificationSystem {
    constructor() {
        this.storedResults = JSON.parse(localStorage.getItem('aiqResults')) || {};
    }

    verifyCertificate(code) {
        // Simulate verification - in real app, this would check a database
        if (this.storedResults.certificateCode === code) {
            return {
                valid: true,
                score: this.storedResults.score,
                level: this.storedResults.level,
                date: new Date(this.storedResults.timestamp).toLocaleDateString(),
                status: 'Verified'
            };
        } else {
            // Check if it's a valid format but not found
            if (code.startsWith('AIQ-') && code.length === 11) {
                return {
                    valid: false,
                    status: 'Certificate not found'
                };
            } else {
                return {
                    valid: false,
                    status: 'Invalid certificate format'
                };
            }
        }
    }

    displayVerificationResult(result) {
        const resultElement = document.getElementById('verifyResult');
        const titleElement = document.getElementById('resultTitle');
        const scoreElement = document.getElementById('resultScore');
        const levelElement = document.getElementById('resultLevel');
        const dateElement = document.getElementById('resultDate');
        const statusElement = document.getElementById('resultStatus');

        if (result.valid) {
            titleElement.textContent = '✅ Certificate Verified';
            titleElement.style.color = '#28a745';
            scoreElement.textContent = result.score;
            levelElement.textContent = result.level;
            dateElement.textContent = result.date;
            statusElement.textContent = result.status;
            statusElement.style.color = '#28a745';
        } else {
            titleElement.textContent = '❌ Verification Failed';
            titleElement.style.color = '#dc3545';
            scoreElement.textContent = '-';
            levelElement.textContent = '-';
            dateElement.textContent = '-';
            statusElement.textContent = result.status;
            statusElement.style.color = '#dc3545';
        }

        resultElement.classList.remove('hidden');
    }
}

// Initialize systems
const testManager = new TestManager();
const verificationSystem = new VerificationSystem();

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Test page functionality
    if (document.getElementById('nextBtn')) {
        document.getElementById('nextBtn').addEventListener('click', () => testManager.nextQuestion());
        document.getElementById('prevBtn').addEventListener('click', () => testManager.previousQuestion());
        document.getElementById('submitBtn').addEventListener('click', () => testManager.submitTest());
        testManager.updateDisplay();
    }
    
    // Results page functionality
    if (document.getElementById('scoreDisplay')) {
        const results = JSON.parse(localStorage.getItem('aiqResults'));
        if (results) {
            document.getElementById('scoreDisplay').textContent = results.score;
            document.getElementById('levelDisplay').textContent = results.level;
            document.getElementById('certificateCode').textContent = results.certificateCode;
            
            // Update progress circle
            const progressCircle = document.querySelector('.score-circle');
            if (progressCircle) {
                progressCircle.style.background = `conic-gradient(#4CAF50 0% ${results.score}%, #e0e0e0 ${results.score}% 100%)`;
            }
        }
    }
    
    // Verification page functionality
    if (document.getElementById('verifyBtn')) {
        document.getElementById('verifyBtn').addEventListener('click', function() {
            const code = document.getElementById('verifyCode').value.trim().toUpperCase();
            if (code) {
                const result = verificationSystem.verifyCertificate(code);
                verificationSystem.displayVerificationResult(result);
            } else {
                alert('Please enter a certificate code');
            }
        });

        // Allow Enter key to trigger verification
        document.getElementById('verifyCode').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                document.getElementById('verifyBtn').click();
            }
        });
    }
});
