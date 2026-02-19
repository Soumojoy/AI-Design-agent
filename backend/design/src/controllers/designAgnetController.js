
import { generateDesign } from "../services/plannerService.js";
import { generateExpoApp } from "../services/codeAgentService.js";

export async function startDesign(req, res){

    
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }
console.log("generating design plan")
    const design = await generateDesign(prompt);

    res.json(design);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
}
    


export async function startExpoCode(req, res) {
   (req, res)
      try {
        const { design } = req.body;
    
        if (!design) {
          return res.status(400).json({ error: "Design missing" });
        }
    
        const projectPath = await generateExpoApp(design);
    
        res.json({
          message: "Expo project created",
          path: projectPath
        });
    
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
      }
    }
