import express from 'express';
import db from '../db/config';

const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());



