import fs from "fs";
import path from "path";
import { spawn } from "child_process";

/**
 * Utility: Run command as Promise (SAFE)
 */
function runCommand(command, args, cwd = process.cwd()) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd,
      stdio: "inherit"
    });

    child.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} ${args.join(" ")} failed`));
    });

    child.on("error", reject);
  });
}

/**
 * MAIN FUNCTION
 */
export async function generateExpoApp(design) {
  if (!design || !design.appName) {
    throw new Error("Invalid design object");
  }

  const appName = design.appName
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

  const basePath = path.join("generated-apps");

  if (!fs.existsSync(basePath)) {
    fs.mkdirSync(basePath);
  }

  const projectPath = path.join(basePath, appName);

  console.log("🚀 Creating Expo project...");

  // 1️⃣ Create Expo app
  await runCommand(
    "npx",
    ["create-expo-app", projectPath, "--template", "blank", "--yes"]
  );

  console.log("🌐 Installing web support (correct way)...");

  // 2️⃣ Install web properly (IMPORTANT: use expo install)
  await runCommand(
    "npx",
    ["expo", "install", "react-dom", "react-native-web"],
    projectPath
  );

  console.log("🧠 Injecting AI App.js...");

 const appJsContent = `
import React from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";

export default function App() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.appTitle}>
        ${design.appName}
      </Text>

      ${design.screens.map(screen => `
        <View style={styles.card}>
          <Text style={styles.screenTitle}>
            ${screen.name}
          </Text>

          ${screen.components.map(comp => `
            <TouchableOpacity style={styles.componentButton}>
              <Text style={styles.componentText}>
                ${comp}
              </Text>
            </TouchableOpacity>
          `).join("")}

        </View>
      `).join("")}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
    padding: 20
  },
  appTitle: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 10
  },
  componentButton: {
    backgroundColor: "#4e73df",
    padding: 12,
    borderRadius: 10,
    marginBottom: 8
  },
  componentText: {
    color: "#ffffff",
    fontSize: 16
  }
});
`;


  fs.writeFileSync(path.join(projectPath, "App.js"), appJsContent);

  console.log("🔥 Starting Expo...");

  // 3️⃣ Start Expo (NO shell true)
  spawn(
    "npx",
    ["expo", "start", "--web"],
    {
      cwd: projectPath,
      stdio: "inherit"
    }
  );

  console.log("✅ Expo process started");

  return {
    projectPath,
    message: "Expo app created and starting server"
  };
}
