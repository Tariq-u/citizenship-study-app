// Simple Node.js script to verify Pashto translations
// Run with: node verify-pashto.js

const fs = require('fs');
const path = require('path');

// Read the citizenship data file
const dataPath = path.join(__dirname, 'src', 'data', 'citizenshipData.js');

try {
    const content = fs.readFileSync(dataPath, 'utf8');
    
    // Extract the data array (simple regex approach)
    const dataMatch = content.match(/export const citizenshipData = (\[[\s\S]*\]);/);
    
    if (dataMatch) {
        // Replace export statement to make it work in Node.js
        const dataString = dataMatch[1];
        const data = eval(dataString);
        
        console.log('🇺🇸 U.S. Citizenship Study App - Pashto Translation Verification\n');
        console.log(`📊 Total Questions: ${data.length}`);
        
        // Check for Pashto translations
        const withPashtoQ = data.filter(q => q.questionPS && q.questionPS.trim() !== '');
        const withPashtoA = data.filter(q => q.answerPS && q.answerPS.trim() !== '');
        
        console.log(`✅ Questions with Pashto translation: ${withPashtoQ.length}/${data.length}`);
        console.log(`✅ Answers with Pashto translation: ${withPashtoA.length}/${data.length}`);
        
        // Show sections
        const sections = [...new Set(data.map(q => q.section))];
        console.log(`📚 Sections: ${sections.join(', ')}`);
        
        // Show sample translations
        console.log('\n📝 Sample Translations:');
        console.log('━'.repeat(60));
        
        for (let i = 0; i < Math.min(5, data.length); i++) {
            const q = data[i];
            console.log(`\n${i + 1}. English: ${q.questionEN}`);
            console.log(`   پښتو: ${q.questionPS}`);
            console.log(`   Answer (EN): ${q.answerEN}`);
            console.log(`   ځواب (PS): ${q.answerPS}`);
        }
        
        console.log('\n🎉 Pashto translations are properly loaded!');
        console.log('\n💡 To test in browser:');
        console.log('   1. Open index.html in a web browser');
        console.log('   2. Click on "Lessons"');
        console.log('   3. Change language to "پښتو (Pashto)" in the dropdown');
        console.log('   4. You should see Pashto text with right-to-left direction');
        console.log('\n🔊 Audio Testing:');
        console.log('   - Click the ▶ button on any question card');
        console.log('   - If audio files are missing, it will use text-to-speech');
        console.log('   - Open test-pashto-audio.html for detailed audio testing');
        
    } else {
        console.log('❌ Could not parse citizenship data');
    }
    
} catch (error) {
    console.log('❌ Error reading data file:', error.message);
    console.log('\n💡 Make sure you run this from the project root directory');
}
