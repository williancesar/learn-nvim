// Day 17: Text Objects Practice - iw, aw, words and WORDS
// Practice with inner word (iw) and around word (aw) text objects
// Notice the difference between words (separated by punctuation) and WORDS (separated by whitespace)

/**
 * JavaScript Text Processing and String Manipulation Library
 * This file contains various functions for working with text, strings, and words
 * Perfect for practicing vim word motions and text object selections
 */

// Word counting and text analysis functions
function countWords(text) {
    if (!text || typeof text !== 'string') {
        return 0;
    }

    const words = text.trim().split(/\s+/);
    return words.filter(word => word.length > 0).length;
}

function countUniqueWords(text) {
    const words = text.toLowerCase().match(/\b\w+\b/g) || [];
    const uniqueWords = new Set(words);
    return uniqueWords.size;
}

function getWordFrequency(text) {
    const words = text.toLowerCase().match(/\b\w+\b/g) || [];
    const frequency = {};

    words.forEach(word => {
        frequency[word] = (frequency[word] || 0) + 1;
    });

    return frequency;
}

function findLongestWord(sentence) {
    const words = sentence.split(/\s+/);
    return words.reduce((longest, current) => {
        return current.length > longest.length ? current : longest;
    }, '');
}

function findShortestWord(sentence) {
    const words = sentence.split(/\s+/).filter(word => word.length > 0);
    if (words.length === 0) return '';

    return words.reduce((shortest, current) => {
        return current.length < shortest.length ? current : shortest;
    });
}

// String transformation and formatting functions
function capitalizeFirstLetter(word) {
    if (!word) return '';
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

function capitalizeWords(sentence) {
    return sentence.split(' ').map(word => capitalizeFirstLetter(word)).join(' ');
}

function toCamelCase(text) {
    return text.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
        return index === 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, '');
}

function toSnakeCase(text) {
    return text.replace(/\W+/g, ' ')
        .split(/ |\B(?=[A-Z])/)
        .map(word => word.toLowerCase())
        .join('_');
}

function toKebabCase(text) {
    return text.replace(/\W+/g, ' ')
        .split(/ |\B(?=[A-Z])/)
        .map(word => word.toLowerCase())
        .join('-');
}

function toPascalCase(text) {
    return text.replace(/(?:^\w|[A-Z]|\b\w)/g, word => {
        return word.toUpperCase();
    }).replace(/\s+/g, '');
}

// Text cleaning and sanitization functions
function removeExtraSpaces(text) {
    return text.replace(/\s+/g, ' ').trim();
}

function removePunctuation(text) {
    return text.replace(/[^\w\s]/gi, '');
}

function removeSpecialCharacters(text) {
    return text.replace(/[^a-zA-Z0-9\s]/g, '');
}

function sanitizeInput(userInput) {
    return userInput
        .trim()
        .replace(/[<>]/g, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+=/gi, '');
}

function normalizeWhitespace(text) {
    return text
        .replace(/\t/g, '    ')  // Replace tabs with 4 spaces
        .replace(/\r\n/g, '\n')  // Normalize line endings
        .replace(/\r/g, '\n')    // Handle old Mac line endings
        .replace(/\n{3,}/g, '\n\n'); // Limit consecutive newlines
}

// Word and phrase search functions
function findWordPositions(text, searchWord) {
    const regex = new RegExp(`\\b${searchWord}\\b`, 'gi');
    const positions = [];
    let match;

    while ((match = regex.exec(text)) !== null) {
        positions.push({
            index: match.index,
            word: match[0],
            length: match[0].length
        });
    }

    return positions;
}

function highlightWords(text, wordsToHighlight) {
    let highlightedText = text;

    wordsToHighlight.forEach(word => {
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        highlightedText = highlightedText.replace(regex, `**${word}**`);
    });

    return highlightedText;
}

function extractMentions(text) {
    const mentionRegex = /@(\w+)/g;
    const mentions = [];
    let match;

    while ((match = mentionRegex.exec(text)) !== null) {
        mentions.push(match[1]);
    }

    return mentions;
}

function extractHashtags(text) {
    const hashtagRegex = /#(\w+)/g;
    const hashtags = [];
    let match;

    while ((match = hashtagRegex.exec(text)) !== null) {
        hashtags.push(match[1]);
    }

    return hashtags;
}

function extractUrls(text) {
    const urlRegex = /https?:\/\/[^\s]+/g;
    return text.match(urlRegex) || [];
}

function extractEmails(text) {
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
    return text.match(emailRegex) || [];
}

// Text comparison and similarity functions
function calculateLevenshteinDistance(str1, str2) {
    const matrix = [];

    for (let i = 0; i <= str2.length; i++) {
        matrix[i] = [i];
    }

    for (let j = 0; j <= str1.length; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= str2.length; i++) {
        for (let j = 1; j <= str1.length; j++) {
            if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j] + 1
                );
            }
        }
    }

    return matrix[str2.length][str1.length];
}

function calculateSimilarity(str1, str2) {
    const distance = calculateLevenshteinDistance(str1, str2);
    const maxLength = Math.max(str1.length, str2.length);

    return maxLength === 0 ? 1 : 1 - (distance / maxLength);
}

function findSimilarWords(targetWord, wordList, threshold = 0.7) {
    return wordList
        .map(word => ({
            word,
            similarity: calculateSimilarity(targetWord.toLowerCase(), word.toLowerCase())
        }))
        .filter(item => item.similarity >= threshold)
        .sort((a, b) => b.similarity - a.similarity);
}

// Text statistics and analysis functions
function getTextStatistics(text) {
    const words = text.match(/\b\w+\b/g) || [];
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);

    const wordLengths = words.map(word => word.length);
    const avgWordLength = wordLengths.reduce((sum, len) => sum + len, 0) / wordLengths.length || 0;

    const sentenceLengths = sentences.map(sentence => sentence.split(/\s+/).length);
    const avgSentenceLength = sentenceLengths.reduce((sum, len) => sum + len, 0) / sentenceLengths.length || 0;

    return {
        characterCount: text.length,
        characterCountNoSpaces: text.replace(/\s/g, '').length,
        wordCount: words.length,
        sentenceCount: sentences.length,
        paragraphCount: paragraphs.length,
        averageWordLength: Math.round(avgWordLength * 100) / 100,
        averageSentenceLength: Math.round(avgSentenceLength * 100) / 100
    };
}

function readabilityScore(text) {
    const stats = getTextStatistics(text);

    // Flesch Reading Ease Score
    const fleschScore = 206.835 -
        (1.015 * stats.averageSentenceLength) -
        (84.6 * (countSyllables(text) / stats.wordCount));

    return {
        fleschReadingEase: Math.round(fleschScore * 100) / 100,
        gradeLevel: getGradeLevel(fleschScore)
    };
}

function countSyllables(text) {
    const words = text.toLowerCase().match(/\b\w+\b/g) || [];

    return words.reduce((totalSyllables, word) => {
        let syllables = word.match(/[aeiouy]+/g) || [];
        if (word.endsWith('e')) syllables.pop();
        if (syllables.length === 0) syllables = [''];
        return totalSyllables + syllables.length;
    }, 0);
}

function getGradeLevel(fleschScore) {
    if (fleschScore >= 90) return 'Very Easy (5th grade)';
    if (fleschScore >= 80) return 'Easy (6th grade)';
    if (fleschScore >= 70) return 'Fairly Easy (7th grade)';
    if (fleschScore >= 60) return 'Standard (8th-9th grade)';
    if (fleschScore >= 50) return 'Fairly Difficult (10th-12th grade)';
    if (fleschScore >= 30) return 'Difficult (College level)';
    return 'Very Difficult (Graduate level)';
}

// Utility functions for text manipulation
function reverseWords(sentence) {
    return sentence.split(' ').reverse().join(' ');
}

function reverseCharacters(text) {
    return text.split('').reverse().join('');
}

function shuffleWords(sentence) {
    const words = sentence.split(' ');
    for (let i = words.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [words[i], words[j]] = [words[j], words[i]];
    }
    return words.join(' ');
}

function truncateText(text, maxLength, suffix = '...') {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - suffix.length) + suffix;
}

function truncateWords(text, maxWords, suffix = '...') {
    const words = text.split(' ');
    if (words.length <= maxWords) return text;
    return words.slice(0, maxWords).join(' ') + suffix;
}

// Export all functions for use in other modules
export {
    countWords,
    countUniqueWords,
    getWordFrequency,
    findLongestWord,
    findShortestWord,
    capitalizeFirstLetter,
    capitalizeWords,
    toCamelCase,
    toSnakeCase,
    toKebabCase,
    toPascalCase,
    removeExtraSpaces,
    removePunctuation,
    removeSpecialCharacters,
    sanitizeInput,
    normalizeWhitespace,
    findWordPositions,
    highlightWords,
    extractMentions,
    extractHashtags,
    extractUrls,
    extractEmails,
    calculateLevenshteinDistance,
    calculateSimilarity,
    findSimilarWords,
    getTextStatistics,
    readabilityScore,
    countSyllables,
    getGradeLevel,
    reverseWords,
    reverseCharacters,
    shuffleWords,
    truncateText,
    truncateWords
};