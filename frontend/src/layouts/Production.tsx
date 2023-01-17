import React from "react";
import { Outlet } from "react-router-dom";

import Wrapper from "../components/Wrapper";
import Sidebar from "../components/sidebar/Sidebar";
import Main from "../components/Main";
import Navbar from "../components/navbar/Navbar";
import Content from "../components/Content";
import Footer from "../components/Footer";
import Settings from "../components/Settings";

import productionItems from '../components/sidebar/productionItems';
import useAppSelector from "../hooks/useAppSelector";
import { selectCurrentUser } from "../redux/slices/authSlice";
import productionAdminItems from "../components/sidebar/productionAdminItems";

const Production = ({ children }: { children?: any }) => {
    const user = useAppSelector(selectCurrentUser);

    let roles = ['Super Admin', 'Office Management', 'Workshop Supervisor', 'Workshop Manager', 'Project Manager']

    let content;

    if (user) {
        if (roles.includes(user.roleId.name)) {
            content = (
                <React.Fragment>
                    <Wrapper>
                        <Sidebar items={productionAdminItems} />
                        <Main>
                            <Navbar />
                            <Content>
                                {children}
                                <Outlet />
                            </Content>
                            <Footer />
                        </Main>
                    </Wrapper>
                    {/* <Settings /> */}
                </React.Fragment>

            )
        } else {
            content = (
                <React.Fragment>
                    <Wrapper>
                        <Sidebar items={productionItems} />
                        <Main>
                            <Navbar />
                            <Content>
                                {children}
                                <Outlet />
                            </Content>
                            <Footer />
                        </Main>
                    </Wrapper>
                    {/* <Settings /> */}
                </React.Fragment>

            )
        }
    } else {
        content = (
            <React.Fragment>
                <Wrapper>
                    <Sidebar items={productionItems} />
                    <Main>
                        <Navbar />
                        <Content>
                            {children}
                            <Outlet />
                        </Content>
                        <Footer />
                    </Main>
                </Wrapper>
                {/* <Settings /> */}
            </React.Fragment>

        )
    }

    return content;
};

export default Production;
