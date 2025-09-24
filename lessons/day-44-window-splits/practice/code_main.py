#!/usr/bin/env python3
"""
Main application file for window split practice.
This file is designed to be the center of your IDE-layout practice.

Practice Goals:
1. Keep this file in the main window
2. Open file_tree.txt on the left
3. Open help_docs.md on the right
4. Open terminal_output.txt at the bottom
"""

import sys
import json
import logging
from datetime import datetime
from pathlib import Path


class WindowPracticeApp:
    """Application for demonstrating multi-window workflows."""

    def __init__(self, config_path='config.json'):
        """Initialize the application.

        TODO: Split window here to see config.json
        """
        self.config = self.load_config(config_path)
        self.logger = self.setup_logging()
        self.data_path = Path('data')

    def load_config(self, path):
        """Load configuration from JSON file.

        PRACTICE: Open config.json in a split to see structure
        """
        try:
            with open(path, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            self.logger.error(f"Config file not found: {path}")
            return {}

    def setup_logging(self):
        """Configure logging for the application.

        PRACTICE: Open terminal_output.txt in bottom split
        to monitor log output while editing
        """
        logging.basicConfig(
            level=logging.DEBUG,
            format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler('terminal_output.txt'),
                logging.StreamHandler(sys.stdout)
            ]
        )
        return logging.getLogger(__name__)

    def process_data(self, input_file):
        """Process input data file.

        PRACTICE:
        1. Open input file in right split
        2. Open output in bottom split
        3. Watch transformation happen
        """
        self.logger.info(f"Processing {input_file}")

        # Read input
        with open(input_file, 'r') as f:
            data = f.read()

        # Transform data (simple uppercase for demo)
        processed = data.upper()

        # Write output
        output_file = input_file.replace('.txt', '_processed.txt')
        with open(output_file, 'w') as f:
            f.write(processed)

        self.logger.info(f"Processed data written to {output_file}")
        return output_file

    def run_analysis(self):
        """Run data analysis workflow.

        SPLIT STRATEGY:
        - Main code here (center)
        - Data files (right split)
        - Results (bottom split)
        - File navigator (left split)
        """
        self.logger.info("Starting analysis workflow")

        # Check all data files
        data_files = list(self.data_path.glob('*.txt'))
        self.logger.info(f"Found {len(data_files)} data files")

        results = []
        for data_file in data_files:
            try:
                result = self.analyze_file(data_file)
                results.append(result)
            except Exception as e:
                self.logger.error(f"Error processing {data_file}: {e}")

        # Save results
        self.save_results(results)
        return results

    def analyze_file(self, filepath):
        """Analyze a single file.

        TDD PRACTICE:
        1. Open test_main.py in right split
        2. Write test first
        3. Implement here
        4. Run tests in terminal split
        """
        with open(filepath, 'r') as f:
            content = f.read()

        analysis = {
            'file': str(filepath),
            'lines': len(content.splitlines()),
            'characters': len(content),
            'words': len(content.split()),
            'timestamp': datetime.now().isoformat()
        }

        self.logger.debug(f"Analysis complete for {filepath}")
        return analysis

    def save_results(self, results):
        """Save analysis results to JSON.

        PRACTICE: Open output in new split to verify
        """
        output_path = self.data_path / 'results.json'
        with open(output_path, 'w') as f:
            json.dump(results, f, indent=2)

        self.logger.info(f"Results saved to {output_path}")

    def interactive_mode(self):
        """Run in interactive mode for window practice.

        WINDOW LAYOUT PRACTICE:
        ┌──────────┬──────────────────┬──────────┐
        │ file_tree│   THIS FILE      │ help_docs│
        │          │                  │          │
        ├──────────┤                  ├──────────┤
        │ search   │                  │ terminal │
        └──────────┴──────────────────┴──────────┘

        Commands to create:
        1. :20vsp file_tree.txt
        2. Ctrl-w l
        3. :80vsp help_docs.md
        4. Ctrl-w h
        5. :sp search_results.txt
        6. Ctrl-w l Ctrl-w l
        7. :sp terminal_output.txt
        """
        print("Interactive mode - perfect for window practice!")
        print("Try these window commands:")
        print("  Ctrl-w v  - Vertical split")
        print("  Ctrl-w s  - Horizontal split")
        print("  Ctrl-w h/j/k/l - Navigate")
        print("  Ctrl-w +/-  - Resize height")
        print("  Ctrl-w >/<  - Resize width")
        print("  Ctrl-w =  - Equalize")

        while True:
            try:
                command = input("\nEnter command (or 'quit'): ")
                if command.lower() == 'quit':
                    break

                # Process command
                self.process_command(command)

            except KeyboardInterrupt:
                print("\nExiting...")
                break

    def process_command(self, command):
        """Process user command.

        PRACTICE: Monitor output in terminal split
        """
        self.logger.info(f"Processing command: {command}")

        if command.startswith('analyze'):
            self.run_analysis()
        elif command.startswith('process'):
            _, filename = command.split()
            self.process_data(filename)
        else:
            print(f"Unknown command: {command}")


def main():
    """Main entry point.

    FINAL PRACTICE:
    Create your ideal development layout:
    1. This file in center (60% width)
    2. Tests on right (25% width)
    3. File tree on left (15% width)
    4. Terminal at bottom (20% height)
    5. Navigate between them efficiently
    """
    app = WindowPracticeApp()

    if '--interactive' in sys.argv:
        app.interactive_mode()
    else:
        app.run_analysis()


if __name__ == '__main__':
    main()