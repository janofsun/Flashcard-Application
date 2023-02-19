# FlashCard Application

This is a FlashCard Application with an interactive CLI (command-line interface). The repository has 1 branch for Java and 1 branch for TypeScript.
Structural testing framework is used for the Java branch, achieving 100% branch coverage. Specification testing is constructed for every method in 
the FlashCard TypeScript source code, achieving 100% specification coverage.

flashcard <cards-file> [options]

Options:
  --help          Show this help                                                                        
  --order <order> The type of ordering to use, default "random"
   						[choices: "random", "worst-first", "recent-mistakes-first"] 
  --repetitions <num> The number of times to each card should be answered
                  successfully. If not provided, every card is presented once,
                  regardless of the correctness of the answer.          
  --invertCards   If set, it flips answer and question for each card. That is, it 
                  prompts with the card's answer and asks the user
                  to provide the corresponding question. 
                  Default: false
