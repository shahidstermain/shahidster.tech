import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const commands = [
  { prompt: "singlestore>", command: "SELECT skill, level FROM expertise ORDER BY level DESC LIMIT 5;", delay: 50 },
];

const queryResults = [
  { skill: "Distributed Systems", level: "█████████░ 95%" },
  { skill: "PostgreSQL", level: "████████░░ 90%" },
  { skill: "Cloud Architecture", level: "████████░░ 88%" },
  { skill: "Query Optimization", level: "███████░░░ 85%" },
  { skill: "Incident Response", level: "███████░░░ 82%" },
];

export const LiveTerminal = () => {
  const [displayedCommand, setDisplayedCommand] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);

  useEffect(() => {
    const command = commands[0];
    let charIndex = 0;
    
    const typeInterval = setInterval(() => {
      if (charIndex <= command.command.length) {
        setDisplayedCommand(command.command.slice(0, charIndex));
        charIndex++;
      } else {
        clearInterval(typeInterval);
        setTimeout(() => setShowResults(true), 500);
      }
    }, command.delay);

    return () => clearInterval(typeInterval);
  }, []);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setCursorVisible(v => !v);
    }, 530);
    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="w-full max-w-lg"
    >
      <div className="rounded-xl overflow-hidden border border-border bg-card/80 backdrop-blur-sm shadow-2xl">
        {/* Terminal header */}
        <div className="flex items-center justify-between px-4 py-3 bg-muted/50 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <span className="text-xs text-muted-foreground font-mono">singlestore-cli</span>
        </div>
        
        {/* Terminal body */}
        <div className="p-4 font-mono text-sm">
          {/* Command line */}
          <div className="flex items-start gap-2 text-muted-foreground">
            <span className="text-primary shrink-0">{commands[0].prompt}</span>
            <span className="text-foreground">
              {displayedCommand}
              {!showResults && (
                <span className={`inline-block w-2 h-4 bg-primary ml-0.5 ${cursorVisible ? 'opacity-100' : 'opacity-0'}`} />
              )}
            </span>
          </div>
          
          {/* Query results */}
          {showResults && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="mt-4"
            >
              {/* Table header */}
              <div className="flex gap-4 text-muted-foreground border-b border-border/50 pb-2 mb-2">
                <span className="w-40">skill</span>
                <span>level</span>
              </div>
              
              {/* Table rows */}
              {queryResults.map((row, index) => (
                <motion.div
                  key={row.skill}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.1 }}
                  className="flex gap-4 py-1 text-foreground"
                >
                  <span className="w-40 text-primary/90">{row.skill}</span>
                  <span className="text-emerald-400 font-medium">{row.level}</span>
                </motion.div>
              ))}
              
              {/* Row count */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="mt-3 text-muted-foreground text-xs"
              >
                5 rows in set (0.023 sec)
              </motion.div>
              
              {/* New prompt */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="mt-2 flex items-center gap-2"
              >
                <span className="text-primary">{commands[0].prompt}</span>
                <span className={`inline-block w-2 h-4 bg-primary ${cursorVisible ? 'opacity-100' : 'opacity-0'}`} />
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
