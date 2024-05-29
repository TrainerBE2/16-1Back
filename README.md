<h1 align="center">Project Management APP API</h1>

<p align="center">
Project Management APP API inspired by Trello, using MySQL and Express.
</p>

<p align="center">
    <img src="https://media.tenor.com/p8Ko6cQs1_AAAAAi/8bit-dance.gif" alt="Arisu Joget" width="200">
</p>

### Installation

To set up the project locally, follow these steps:

1. **Clone the repository**:
    ```sh
    git clone https://github.com/TrainerBE2/16-1Back.git
    cd 16-1Back
    ```

2. **Install Dependencies**:
    ```sh
    npm install
    ```

3. **Set Up Environment Variables**:
    ```sh
    mv .env.example .env
    ```
    > Edit the `.env` file to include your specific environment variables, such as database connection details.

4. **Run Migrations and Seed Database**:
    ```sh
    node library/database -migrate
    node library/database -seed
    ```

5. **Start the Server**:
    ```sh
    node app
    ```
    > The server will start on the default port 3000. You can now access your web application by navigating to [http://localhost:3000](http://localhost:3000) in your web browser.


### Documentation

The documentation is too extensive to fit into a single README file, You can find it [here](https://documenter.getpostman.com/view/35096375/2sA3Qqgsjs).
