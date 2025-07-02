#!/usr/bin/env python
"""
Script to set up the Django admin with master data.
This script will:
1. Make migrations for the masters app
2. Apply all migrations
3. Populate the database with initial master data
"""
import os
import subprocess
import sys

def run_command(command):
    """Run a shell command and print output."""
    print(f"Running: {command}")
    process = subprocess.Popen(
        command,
        shell=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        universal_newlines=True
    )
    
    # Print output in real-time
    for line in process.stdout:
        print(line.strip())
    
    # Wait for the process to complete
    process.wait()
    
    # Check if the command was successful
    if process.returncode != 0:
        print(f"Error: Command failed with return code {process.returncode}")
        return False
    
    return True

def main():
    """Main function to run the setup."""
    # Get the path to the Python executable in the current environment
    python_executable = sys.executable
    
    # Make migrations for the masters app
    if not run_command(f"{python_executable} manage.py makemigrations masters"):
        return
    
    # Apply all migrations
    if not run_command(f"{python_executable} manage.py migrate"):
        return
    
    # Populate the database with initial master data
    if not run_command(f"{python_executable} manage.py populate_masters"):
        return
    
    print("\nSetup completed successfully!")
    print("You can now access the Django admin at http://localhost:8000/admin/")
    print("Login with your superuser credentials.")

if __name__ == "__main__":
    # Change to the directory where this script is located
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    main()