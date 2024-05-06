import React, { Component } from 'react';
import AppRouting from './AppRouting';
import Navbar from './shared/Navbar';
import Sidebar from './shared/Sidebar';
import Footer from './shared/Footer';

class App extends Component {
    render() {
        return (
            <div className="app">
                <Navbar />
                <div className="container">
                    <div className="py-4">
                        <div className="row">
                            <div className="col-3">
                                <Sidebar />
                            </div>
                            <div className="col-9">
                                <AppRouting />
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
}

export default App;
